import { Baseball } from './namespace';

if (typeof window === 'object') {
    ((window as unknown) as { Baseball: typeof Baseball }).Baseball = Baseball;
}

export default Baseball;
