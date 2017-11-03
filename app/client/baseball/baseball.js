import { Baseball } from './namespace';

if (typeof window === 'object') {
    window.Baseball = Baseball;
}

export { Baseball }