// 현재 사용자
const me = { id:'dokkasi', name:'독까시', avatar:'images/dokkasi.png' };

// 멤버
const users = [
  me,
  { id:'hyuni',    name:'현이',     avatar:'images/hyuni.jpeg' },
  { id:'jeongran', name:'정란',     avatar:'images/jeongran.jpeg' },
  { id:'jeongwoo', name:'정우',     avatar:'images/jeongwoo.jpeg' },
  { id:'minji',    name:'민지',     avatar:'images/minji.jpeg' },
  { id:'seongguk', name:'성국',     avatar:'images/seongguk.jpeg' },
  { id:'woong',    name:'웅',       avatar:'images/woong.jpeg' },
];

// 스토리(필요 시 여러 장)
const storyImages = {
  dokkasi: ['images/dokkasi.png','images/woong.jpeg','images/seongguk.jpeg'],
  hyuni:   ['images/hyuni.jpeg'],
  jeongran:['images/jeongran.jpeg'],
  jeongwoo:['images/jeongwoo.jpeg'],
  minji:   ['images/minji.jpeg'],
  seongguk:['images/seongguk.jpeg'],
  woong:   ['images/woong.jpeg'],
};

/* ---------- 스토리 렌더 ---------- */
const storiesTrack=document.getElementById('storiesTrack');
function storyItem(u){
  const imgs=(storyImages[u.id]||[u.avatar]).map(src=>`<img src="${src}" alt="${u.name}">`).join('');
  return `
    <div class="story">
      <div class="ring"><div class="inner">
        <div class="frame"><div class="pan">${imgs}</div></div>
      </div></div>
      <p>${u.name}</p>
    </div>
  `;
}
storiesTrack.innerHTML = users.map(storyItem).join('');

/* ---------- 피드 데이터 ---------- */
const captions = {
  dokkasi:'방금 전 셀카 😎', hyuni:'오늘도 빛남 ✨', jeongran:'새 신발!', jeongwoo:'산책중',
  minji:'습관이 만든다', seongguk:'카메라 셋업', woong:'ESTP의 하루'
};

const basePosts = users.map((u,i)=>({
  id:`${u.id}_${i}`,
  user:u, media:u.avatar,
  likes:Math.floor(200+Math.random()*800),
  caption:captions[u.id]||'',
  time:`${Math.floor(1+Math.random()*23)}시간 전`,
  comments:[{author:'현이',avatar:'images/hyuni.jpeg',text:'와 분위기 좋다!'}, {author:'정란',avatar:'images/jeongran.jpeg',text:'이쁘다😊'}],
}));

// 첫 번째 포스트에 '추가 카드' 예시를 붙이도록 플래그
basePosts[0].extras = true;

/* ---------- 리액션 SVG ---------- */
const svgs = {
  heart:`<svg viewBox="0 0 24 24"><path d="M12.1 21.35 10 19.45C5 15 2 12.36 2 8.5A4.5 4.5 0 0 1 6.5 4 5.5 5.5 0 0 1 12 6.09 5.5 5.5 0 0 1 17.5 4 4.5 4.5 0 0 1 22 8.5c0 3.86-3 6.5-8 10.95l-1.9 1.9Z"/></svg>`,
  fire:`<svg viewBox="0 0 24 24"><path d="M12 2s3 3 3 6-2 4-2 6 2 3 2 5-2 3-3 3-5-2-5-6 3-6 5-8 0-4 0-6Z"/></svg>`,
  love:`<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.65-7 9-7 9Z"/></svg>`,
  lol:`<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-4 8h4M12 10h4M7 15c1.2 2 3 3 5 3s3.8-1 5-3" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  comment:`<svg viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 0 0-1 1v14l4-3h13a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`
};

/* ---------- 피드 렌더 ---------- */
const feedEl=document.getElementById('feed');

function memberTagLine(viewers){
  const names = viewers.map(u=>u.name);
  const label = names.length>3 ? `${names.slice(0,3).join(', ')} 외 ${names.length-3}명` : names.join(', ');
  return `<div class="member-tags">👀 <b>${label}</b> 이(가) 이 게시글을 보고 있어요</div>`;
}

function extrasCards(){
  return `
    <div class="extra-cards">
      <!-- 공지 카드 -->
      <div class="card">
        <div class="icon-wrap">📢</div>
        <div>
          <p class="title">정모 공지</p>
          <p class="desc">9월 19일(금) 7시 · 세부사항은 추후 업데이트 예정</p>
        </div>
      </div>
      <!-- 넷플릭스 낚시 카드 -->
      <button class="card netflix" type="button" id="netflixBait">
        <div class="icon-wrap">
          <!-- N 로고 -->
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path fill="#fff" d="M6 2h4l4 10V2h4v20h-4l-4-10v10H6z"/>
          </svg>
        </div>
        <div>
          <p class="title">NETFLIX</p>
          <p class="desc">요즘 화제의 무료 영화 상영중?! 클릭해서 확인 👀</p>
        </div>
      </button>
    </div>
  `;
}

function postTemplate(p){
  // 리액션 초기값
  p.reactions = p.reactions || {heart:0, fire:0, love:0, lol:0};
  const others = users.filter(u=>u.id!==p.user.id).sort(()=>Math.random()-0.5).slice(0,5);

  const commentsHTML = p.comments.map(c=>`
    <div class="comment-item">
      <img src="${c.avatar}" alt="${c.author}">
      <div class="bubble"><b>${c.author}</b>${c.text}</div>
    </div>
  `).join('');

  return `
  <article class="post" data-post="${p.id}">
    <header class="post__head">
      <img src="${p.user.avatar}" alt="${p.user.name}">
      <div><div class="name">${p.user.name}</div></div>
    </header>

    <div class="post__media"><img src="${p.media}" alt=""></div>

    <!-- 리액션 바 -->
    <div class="post__actions">
      <div class="post__left">
        <button class="action heart" data-reaction="heart" aria-label="좋아요">${svgs.heart}<span class="count">${p.reactions.heart}</span></button>
        <button class="action fire"  data-reaction="fire"  aria-label="불타오르네">${svgs.fire}<span class="count">${p.reactions.fire}</span></button>
        <button class="action love"  data-reaction="love"  aria-label="최고">${svgs.love}<span class="count">${p.reactions.love}</span></button>
        <button class="action lol"   data-reaction="lol"   aria-label="웃겨요">${svgs.lol}<span class="count">${p.reactions.lol}</span></button>
      </div>
      <button class="action c-open" aria-label="댓글 열기">${svgs.comment}</button>
    </div>

    ${memberTagLine(others)}

    <!-- 댓글 목록 -->
    <div class="comments">
      ${commentsHTML}
    </div>

    <!-- 댓글 입력 -->
    <form class="comment-form" autocomplete="off">
      <img src="${me.avatar}" alt="${me.name}">
      <small>${me.name}로 댓글 달기</small>
      <input name="comment" type="text" placeholder="댓글을 입력하세요…" />
      <button type="submit">게시</button>
    </form>

    ${p.extras ? extrasCards() : ""}
  </article>`;
}

feedEl.innerHTML = basePosts.map(postTemplate).join('');

/* ---------- 이벤트: 리액션/댓글/넷플릭스 ---------- */
feedEl.addEventListener('click', (e)=>{
  const btn = e.target.closest('.action');
  if(btn && btn.dataset.reaction){
    const post = btn.closest('.post');
    const id = post.dataset.post;
    const data = basePosts.find(p=>p.id===id);
    const key = btn.dataset.reaction;
    data.reactions[key] = (data.reactions[key]||0) + 1;
    btn.querySelector('.count').textContent = data.reactions[key];
    btn.classList.add('active');
  }
  if(e.target.closest('#netflixBait')){
    alert('🎬 무료영화 상영! ...는 낚시 ㅋㅋ (농담) — 그래도 다같이 영화 보러 가자 😄');
  }
});

feedEl.addEventListener('submit',(e)=>{
  const form = e.target.closest('.comment-form'); if(!form) return;
  e.preventDefault();
  const post = form.closest('.post');
  const id = post.dataset.post;
  const data = basePosts.find(p=>p.id===id);
  const input = form.querySelector('input[name="comment"]');
  const text = (input.value||'').trim();
  if(!text) return;
  const newC = {author: me.name, avatar: me.avatar, text};
  data.comments.push(newC);

  const wrap = post.querySelector('.comments');
  const node = document.createElement('div');
  node.className = 'comment-item';
  node.innerHTML = `<img src="${newC.avatar}" alt="${newC.author}"><div class="bubble"><b>${newC.author}</b>${newC.text}</div>`;
  wrap.appendChild(node);

  input.value = '';
});
