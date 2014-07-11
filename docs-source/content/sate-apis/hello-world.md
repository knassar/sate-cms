{
    "plugins": [
        {
            "type": "hello-world",
            "id": "hello-world-spanish",
            "language": "spanish"
        },
        {
            "type": "hello-world",
            "id": "hello-world-german",
            "language": "german"
        }
    ]
}
@intro:

Sate plugins encapsulate reusable data, configuration, templates and client resources in a "plug-and-play" package. Sate includes several useful default plugins, and additional plugins are easy to write and are registered with Sate simply by dropping them into the plugins directory of the Sate site.

The Hello World plugin is provided as a template & tutorial to learn how to create your own.

@content:

<dl>
    <dt>English (run-time configured): </dt>
    <dd>
        {{#plugin-hello-world}}
        {
            "language": "english"
        }
        {{/plugin-hello-world}}
    </dd>
    <dt>Spanish (using first compile-time plugin config):</dt>
    <dd>
        {{{plugin-hello-world}}}
    </dd>
    <dt>German (referencing an explicit compile-time plugin config by id):</dt>
    <dd>
        {{#plugin-hello-world}}
        {
            "id": "hello-world-german"
        }
        {{/plugin-hello-world}}
    </dd>
    <dt>Latin (run-time configured):</dt>
    <dd>
        {{#plugin-hello-world}}
        {
            "language": "latin"
        }
        {{/plugin-hello-world}}
    </dd>
    <dt>French (run-time configured, unsupported, falling back to default):</dt>
    <dd>
        {{#plugin-hello-world}}
        {
            "language": "french"
        }
        {{/plugin-hello-world}}
    </dd>
</dl>
    
{{{plugin-sate-sequenceNav}}}

