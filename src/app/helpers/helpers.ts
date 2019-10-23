export const multilineEllipsis = (selector) => {
  const container = document.querySelector(selector);

  const p = container.querySelector('p');
  const containerHeight = container.clientHeight;

  if (p.offsetHeight > containerHeight) {
    p.textContent = p.textContent.replace(/\W*\s(\S)*$/, '...');
  }
};
