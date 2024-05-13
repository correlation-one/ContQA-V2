class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://codio.com/');
        await page.pause();


    }

    async clicklogin() {
        await this.page.getByRole('menuitem', { name: 'Sign In' }).click();
    }

    async fillEmail(codioemail) {
        await this.page.fill('[placeholder="Email or Username"]', codioemail);
    }
    
    async fillPassword(codiopass) {
        await this.page.fill('[placeholder="Password"]', codiopass);
        await this.page.pause();

    }

    async submit() {
        await this.page.click('span[class=auth0-label-submit]');
    }

    async login(credentials) {
        await this.navigate();
        await this.fillEmail(credentials.codioemail);
        await this.fillPassword(credentials.codiopass);
        await this.submit();
    }
}

module.exports = LoginPage;