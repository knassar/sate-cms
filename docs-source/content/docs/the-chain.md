{{<intro}}
    <p>
        The Chain is a structured inheritance sequence which allows Sate pages to be functional with as little explicit definition as possible.
    </p>
{{</intro}}
{{<content}}
    <p>
        Any properties defined at each link in the Chain gets overridden in sequence from left to right by subsequent links. Below is a basic diagram of the Chain in a Sate website.
    </p>
    <ol class="the-chain-diagram">
        <li><span>Sate Defaults</span></li>
        <li><span>website.json</span></li>
        <li><span>page content file's pageData</span></li>
        <li><span>Sate command-line flags</span></li>
    </ol>
    <p>There are several variations on this basic Chain of inheritance which apply to specific properties.</p>
    <h3>The Config Chain</h3>
    <p>

    </p>
    <ol class="the-chain-diagram">
        <li><span>Sate Defaults</span></li>
        <li><span>siteConfig in website.json</span></li>
        <li><span>siteConfig in pageData block</span></li>
        <li><span>Sate command-line flags</span></li>
    </ol>
    <h3>The Menu Chain</h3>
    <p>

    </p>
    <ol class="the-chain-diagram">
        <li><span>website.json page menu</span></li>
        <li><span>page content file's pageData</span></li>
    </ol>
<!-- <div class="content-footer">next: <a href="/docs/using-sate" class="next">Using Sate</a></div> -->
    {{{plugin-sate-sequenceNav}}}
    <style type="text/css" media="screen">
        .the-chain-diagram {
            margin: 2em 0;
            padding: 0;
        }
        .the-chain-diagram::after {
            content: "";
            display: block;
            clear: left;
        }
        .the-chain-diagram li {
            position: relative;
            display: table;
            float: left;
            width: 125px;
            height: 100px;
            border: orange 1px solid;
            margin-right: 2em;
            border-radius: 50%;
        }
        .the-chain-diagram li > span {
            padding: 0.5em 1em;
            display: table-cell;
            vertical-align: middle;
            text-align: center;
        }
        .the-chain-diagram li::before {
            content: "\2039";
            font-family: "Helvetica Neue", "Arial Narrow", "Helvetica", "Arial", serif;
            position: absolute;
            font-size: 5rem;
            font-weight: 100;
            top: 0;
            left: -1.5rem;
            color: orange;
            line-height: 80px;
        }
        .the-chain-diagram li:first-child::before {
            content: none;
        }
        @media (max-width: 960px) {
          .the-chain-diagram {
            zoom: 90%;
          }
        }
        @media (max-width: 900px) {
          .the-chain-diagram {
            zoom: 80%;
          }
        }
        @media (max-width: 850px) {
            .the-chain-diagram {
              zoom: 1;
            }
            .the-chain-diagram li {
                float: none;
                width: 200px;
                height: 60px;
                margin-right: 0;
                margin-bottom: 2em;
            }
            .the-chain-diagram li::before {
                content: "\2039";
                font-family: "Helvetica Neue", "Arial Narrow", "Helvetica", "Arial", serif;
                position: absolute;
                font-size: 5rem;
                font-weight: 100;
                top: -1.5rem;
                left: 1rem;
                right: 0;
                text-align: center;
                color: orange;
                line-height: 1rem;
                -webkit-transform: rotate(90deg);
            }
        }
    </style>
{{</content}}