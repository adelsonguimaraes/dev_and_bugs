"use strict";
const SOCKET = io('/');
SOCKET.emit('watching-player');
SOCKET.on('mouse-position-received', (data) => {
    showLine(data);
});
BULLET_SIZE = 15;
ARENA_ROWS = 6;
ARENA_COLUMNS = 8;
ARENA_GRIDS = [];
GRID_SIZE = 60;
GRID_PADDING = 10;
const bg1 = '#40404081';
const bg2 = '#34343481';
const createArenaGrid = () => {
    const ul = document.createElement('ul');
    ul.style.margin = 0;
    ul.style.padding = 0;
    ul.style.width = '100%';
    ul.style.height = '100%';
    ul.style.listStyle = 'none';
    ul.style.display = 'flex';
    ul.style.flexDirection = 'row';
    ul.style.flexWrap = 'wrap';
    let count = 0;
    let invert = false;
    for (let r = 0; r < ARENA_ROWS * ARENA_COLUMNS; r++) {
        bg = null;
        if (count >= ARENA_ROWS) {
            invert = !invert;
            count = 0;
        }
        if (invert) {
            bg = ((r % 2) == 0) ? bg2 : bg1;
        }
        else {
            bg = ((r % 2) == 0) ? bg1 : bg2;
        }
        const li = document.createElement('li');
        li.id = 'slot_' + r;
        li.style.width = GRID_SIZE + 'px';
        li.style.height = GRID_SIZE + 'px';
        li.style.backgroundColor = bg;
        li.style.padding = GRID_PADDING + 'px';
        li.style.margin = '0';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'center';
        ARENA_GRIDS.push({ 'grid': li, 'mob': null });
        ul.append(li);
        count++;
    }
    document.querySelector('div.arena').append(ul);
};
const showLine = (e) => {
    var _a;
    const spr = document.querySelector('div.shot--position').getBoundingClientRect();
    const arena_rect = document.querySelector('div.arena').getBoundingClientRect();
    // calculation relative position
    e.pageY = e.pageY * document.body.offsetHeight / e.pageH;
    e.pageX = e.pageX * document.body.offsetWidth / e.pageW;
    const x1 = spr.left + (spr.width / 2) - arena_rect.x;
    const y1 = spr.top + (spr.height / 2) - arena_rect.y;
    const x2 = e.pageX - arena_rect.x;
    const y2 = e.pageY - arena_rect.y;
    const length = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    const cx = ((x1 + x2) / 2);
    const cy = ((y1 + y2) / 2);
    const bx = (spr.x + (spr.width / 2) - (BULLET_SIZE / 2) - arena_rect.x);
    const by = (spr.y - arena_rect.y);
    ANGLE = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
    LINE = (_a = document.querySelector('div#line')) !== null && _a !== void 0 ? _a : document.createElement('div');
    LINE.id = 'line';
    LINE.style.color = 'green';
    LINE.style.height = '5px';
    LINE.style.backgroundColor = 'green';
    LINE.style.position = 'absolute';
    LINE.style.top = cy - (LINE.offsetHeight / 2) + 'px';
    LINE.style.left = cx - (LINE.offsetWidth / 2) + 'px';
    LINE.style.width = length + 'px';
    LINE.style.transform = `rotate(${ANGLE}deg)`;
    document.querySelector('div.arena').append(LINE);
};
document.addEventListener('DOMContentLoaded', (_) => {
    createArenaGrid();
});
