import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('https://educontrol-website-pwa.vercel.app/');
  sleep(1);
}
