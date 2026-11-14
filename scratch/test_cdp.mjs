import { spawn } from 'node:child_process';
import http from 'node:http';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
console.log('Spawning headless Chrome for QA inspection...');

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json/version', (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Chrome Debugger version info:', body);
      chrome.kill();
    });
  }).on('error', (err) => {
    console.log('HTTP error connecting to Chrome Debugger:', err.message);
    chrome.kill();
  });
}, 1500);
