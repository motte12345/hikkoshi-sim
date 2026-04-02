import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { writeFileSync } from 'fs';

// Register Japanese font
GlobalFonts.registerFromPath('C:/Windows/Fonts/meiryo.ttc', 'Meiryo');
GlobalFonts.registerFromPath('C:/Windows/Fonts/meiryob.ttc', 'MeiryoBold');

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background gradient
const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
bg.addColorStop(0, '#1d4ed8');
bg.addColorStop(0.5, '#2563eb');
bg.addColorStop(1, '#3b82f6');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Decorative circles
ctx.globalAlpha = 0.08;
ctx.fillStyle = '#ffffff';
ctx.beginPath();
ctx.arc(150, 500, 200, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(1050, 130, 250, 0, Math.PI * 2);
ctx.fill();
ctx.beginPath();
ctx.arc(900, 550, 150, 0, Math.PI * 2);
ctx.fill();
ctx.globalAlpha = 1.0;

// White card area
const cardX = 60;
const cardY = 80;
const cardW = WIDTH - 120;
const cardH = HEIGHT - 160;
const cardR = 24;

ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
ctx.beginPath();
ctx.moveTo(cardX + cardR, cardY);
ctx.lineTo(cardX + cardW - cardR, cardY);
ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardR, cardR);
ctx.lineTo(cardX + cardW, cardY + cardH - cardR);
ctx.arcTo(cardX + cardW, cardY + cardH, cardX + cardW - cardR, cardY + cardH, cardR);
ctx.lineTo(cardX + cardR, cardY + cardH);
ctx.arcTo(cardX, cardY + cardH, cardX, cardY + cardH - cardR, cardR);
ctx.lineTo(cardX, cardY + cardR);
ctx.arcTo(cardX, cardY, cardX + cardR, cardY, cardR);
ctx.closePath();
ctx.fill();

// Main title
ctx.fillStyle = '#1e293b';
ctx.font = '700 56px MeiryoBold, Meiryo';
ctx.fillText('引越し費用シミュレーター', 120, 200);

// Subtitle
ctx.fillStyle = '#64748b';
ctx.font = '28px Meiryo';
ctx.fillText('引越し費用の概算をステップ形式で簡単計算', 120, 265);

// Divider line
ctx.strokeStyle = '#2563eb';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.moveTo(120, 305);
ctx.lineTo(1080, 305);
ctx.stroke();

// Feature items with bullet
const features = [
  '引越し費用シミュレーター',
  '単身パック比較',
  '初期費用トータル計算',
  '不用品処分コスト計算',
];

const startY = 370;
const colWidth = 480;

features.forEach((text, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 120 + col * colWidth;
  const y = startY + row * 60;

  // Blue bullet
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.arc(x + 8, y - 8, 6, 0, Math.PI * 2);
  ctx.fill();

  // Text
  ctx.fillStyle = '#1e293b';
  ctx.font = '26px Meiryo';
  ctx.fillText(text, x + 28, y);
});

// Bottom tagline
ctx.fillStyle = '#2563eb';
ctx.font = '700 22px MeiryoBold, Meiryo';
ctx.fillText('繁忙期・曜日・時間帯の料金差も明示  ｜  完全無料', 120, 520);

// Output
const buffer = canvas.toBuffer('image/png');
writeFileSync('public/ogp.png', buffer);
console.log('Generated public/ogp.png (1200x630)');
