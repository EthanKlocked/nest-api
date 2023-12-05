import * as lib from './library';

describe('library', () => {
    it('generateRandomNumber', () => {
        expect(lib.generateRandomNumber).toBeDefined();
        const digitString = lib.generateRandomNumber(10);
        console.log(digitString);
        expect(typeof digitString).toBe('string');
    });
});
