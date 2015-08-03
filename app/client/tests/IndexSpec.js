describe('main index', function() {
    it('is a web page', function() {
        browser.get('localhost'); // localhost for this project

        expect(browser.getTitle()).toEqual('野球愛好会');
    });
});