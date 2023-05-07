function showsearch(bol) {
  if (bol) {
    document.querySelector('.search-content').classList.add('show');
    document.getElementById('search-global').focus();
  } else {
    document.querySelector('.search-content').classList.remove('show');
  }
}

function collectTag() {
  const tagArr = document.querySelectorAll('a[data-text]');
  const res = [];
  tagArr.forEach(item => {
    res.push({
      text: item.innerText,
      node: item,
    });
  });
  return res;
}

function showList(target, bol = true) {
  const listDom = document.querySelector('.list');
  if (bol) {
    listDom.classList.remove('hidden');
    const clientInfo = target.getBoundingClientRect();
    const left = clientInfo.left;
    const top = clientInfo.top + clientInfo.height;
    listDom.style.setProperty('left', left + 'px');
    listDom.style.setProperty('top', top + 8 + 'px');
    listDom.style.setProperty('width', clientInfo.width + 'px');
  } else {
    listDom.classList.add('hidden');
  }
}

function renderList(list) {
  const content = document.querySelector('.list-content');
  let str = '';
  if (list.length) {
    str = list
      .map(
        (item, i) => `<li class='list-item'>
        <span class="name">
          ${item.text}
        </span>
        <span data-index='${i}' class="btn">
          确定
        </span></li>`
      )
      .join('');
    content.innerHTML = str;
    const firstDom = content.firstElementChild;
    const fh = firstDom.getBoundingClientRect().height;
    if (list.length >= 4) {
      document.querySelector('.list').style.height = `${fh * 4}px`;
    } else {
      document.querySelector('.list').style.height = `${fh * list.length}px`;
    }
    content.addEventListener(
      'click',
      function(ev) {
        const dom = ev.target;
        if (dom.classList.contains('btn')) {
          const index = parseInt(dom.dataset.index);
          const domA = list[index].node;
          domA.click();
        }
      },
      false
    );
    document.addEventListener('click', function(ev) {
      if (
        !document.querySelector('.list').contains(ev.target) &&
        ev.target.id !== 'search-global'
      ) {
        document.querySelector('.list').classList.add('hidden');
      }
    });
  }
}

document.querySelector('#search-global').addEventListener(
  'input',
  ev => {
    const value = ev.target.value;
    const res = collectTag();
    const s = res.filter(item => item.text.includes(value));
    if (s.length && value) {
      showList(ev.target);
      renderList(s);
    } else {
      showList(ev.target, false);
    }
  },
  {
    capture: false,
  }
);

window.addEventListener(
  'keydown',
  ev => {
    if (ev.metaKey && ev.key === 'f') {
      ev.preventDefault();
      showsearch(true);
      return;
    }
    if (ev.keyCode === 27) {
      ev.preventDefault();
      showsearch(false);
      return;
    }
  },
  false
)

console.log(document.currentScript)
