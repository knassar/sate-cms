{
    "name": "Sate APIs",
    "articleSort": [
        "/sate-apis/developing-plugins",
        "/sate-apis/the-sate-lifecycle"
    ],
    "plugins": [
        {
            "type": "sate-menu",
            "id": "pageMenu",
            "inherited": true,
            "items": [
                "/sate-apis/developing-plugins",
                "/sate-apis/the-sate-lifecycle",
                {
                    "name": "Sate Types Documentation"
                },
                "/sate-apis/types/sate",
                "/sate-apis/types/website",
                "/sate-apis/types/page",
                "/sate-apis/types/page-descriptor",
                "/sate-apis/types/plugin",
                "/sate-apis/types/request-handler"
            ]
        }
    ]
}

@intro:

Sate started out as a set of scripts to generate my own website. On its way to becoming Sate, it has gone through several iterations towards a reasonably well-structured API. Although it's not *done* yet, I expect to reach a 1.0 API soon. 

Although the intent is that the primary method for extension is through Plugins, several levels of the Sate system expose APIs for plugin authors to hook into the various processes that make up a Sate publishing workflow.

### Versioning

Here is the preliminary documentation for extending Sate. This documentation will change as I near 1.0, but since I'm already driving more than one website with Sate, I intend to keep breaking changes to a minimum prior to 1.0. After 1.0, these APIs will be locked for that major revision.



