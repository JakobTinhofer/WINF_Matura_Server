class Template{
    constructor(html){
        this.html = html;
    }

    build(params){
        let b = String(this.html);
        for (const p in params) {
            const re = new RegExp("\{" + p + "\}", "gi");
            b = b.replace(re, params[p]);
        }
        return b;
    }
};

module.exports = Template;