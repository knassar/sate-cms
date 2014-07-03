{
    "extraStyles": [
        "/styles/sate-chain.css"
    ]
}
@intro:

The Chain is a structured inheritance sequence which allows Sate pages to be functional with as little explicit definition as possible.


@content:

Any properties defined at each link in the Chain gets overridden in sequence from left to right by subsequent links. Below is a basic diagram of the Chain in a Sate website.

<ol class="the-chain-diagram">
    <li><span>Sate Defaults</span></li>
    <li><span>website.json</span></li>
    <li><span>page content file's pageData</span></li>
    <li><span>Sate command-line flags</span></li>
</ol>

There are several variations on this basic Chain of inheritance which apply to specific properties.

### The Config Chain

<ol class="the-chain-diagram">
    <li><span>Sate Defaults</span></li>
    <li><span>siteConfig in website.json</span></li>
    <li><span>siteConfig in pageData block</span></li>
    <li><span>Sate command-line flags</span></li>
</ol>


### The Menu Chain

<ol class="the-chain-diagram">
    <li><span>website.json page menu</span></li>
    <li><span>page content file's pageData</span></li>
</ol>

{{{plugin-sate-sequenceNav}}}
