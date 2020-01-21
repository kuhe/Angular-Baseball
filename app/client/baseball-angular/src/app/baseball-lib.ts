// Locally link the baseball module if necessary.
// This allows Angular's TS workspace to interact more easily with a plain ES module.

// import {Baseball} from 'baseball';

const Baseball = (<any>window).Baseball;

export default Baseball;

export { Baseball };
