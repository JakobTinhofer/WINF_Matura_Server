class Template{
    constructor(html){
        this.html = html;
    }

    build(params){
        for (const p in params) {
            const re = new RegExp("\{" + p + "\}", "gi");
            this.html = this.html.replace(re, params[p]);
        }
        return this.html;
    }
};

module.exports = Template;