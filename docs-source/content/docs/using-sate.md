{{<intro}}
        <p>
            Sate is a Node.js command-line-application that is run with the following syntax:
        </p>
        <pre>
    &gt; node sate.js [directive] [flags]
</pre>
        <p>
            Sate has four main directives:
        </p>
{{</intro}}
{{<content}}
        <table>
            <tr>
                <th>
                    Directive
                </th>
                <th>
                    Explanation
                </th>
            </tr>
            <tr>
                <td>
                    develop
                </td>
                <td>
                    Starts a stateless web-server which serves website page requests by re-evaluating all website sources on each request. This is useful when developing site content, as individual pages can be tested by reloading the browser page with each tweak. If no directive is provided, 'develop' is assumed.
                </td>
            </tr>
            <tr>
                <td>
                    run
                </td>
                <td>
                    Starts a web-server which serves website page requests. This differs from 'develop' in that the website sources are evaluated only once at server-start time. The server must be restarted for source changes to have any affect.
                </td>
            </tr>
            <tr>
                <td>
                    deploy
                </td>
                <td>
                    Evaluates all website sources and generates the entire website as static pages, for serving from Apache, Nginx, or other web server. Use this in production for highest performance.
                </td>
            </tr>
            <tr>
                <td>
                    analyze
                </td>
                <td>
                    Evaluate all website sources just as 'run' or 'deploy' without producing any artifacts or server processes. Returns a report on any fatal or non-fatal issues found, such as un-parseable config or missing page content.
                </td>
            </tr>
        </table>
        <p>
            Sate has a series of optional flags which can be combined with the directive to provide finer control over the directive:
        </p>
        <table>
            <tr>
                <th>
                    Flag
                </th>
                <th>
                    Explanation
                </th>
            </tr>
            <tr>
                <td class="nowrap">
                    -w [path]<br>
                    --website [path]
                </td>
                <td>
                    Provide a path and filename to the website.json file. If not provided, looks for './website.json'
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    -c [path]<br>
                    --content [path]
                </td>
                <td>
                    Provide a path to the website content. If not provided, checks for 'siteConfig.content' in website.json, then assumes './content'
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    -p [port number]<br>
                    --port [port number]
                </td>
                <td>
                    The port to listen on when running 'develop' or 'run' directive. If not provided, checks for 'siteConfig.port' in website.json, then defaults to Sate.defaults.port
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    -b [path]<br>
                    --build-path [path]
                </td>
                <td>
                    Path to output deploy artifacts when running 'deploy'. If not provided, checks for 'siteConfig.buildPath' in website.json, then defaults to './build/.'
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    --clean
                </td>
                <td>
                    When running 'deploy', use this flag to tell Sate that it is allowed to delete the contents of the build path
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    -l [path]<br>
                    --log [path]
                </td>
                <td>
                    Path to output logging when running 'run'. If not provided, checks for 'siteConfig.log' in website.json, then defaults to './log/.'
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    -v<br>
                    --verbose
                </td>
                <td>
                    Turns on 'verbose' logging. If not provided, logging level is defined by 'siteConfig.logLevel' in website.json, then assumes normal logging.
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    -q<br>
                    --quiet
                </td>
                <td>
                    Turns on 'quiet' (minimal) logging. If not provided, logging level is defined by 'siteConfig.logLevel' in website.json, then assumes normal logging.
                </td>
            </tr>
            <tr>
                <td class="nowrap">
                    -h<br>
                    --help
                </td>
                <td>
                    Display help on how to use Sate
                </td>
            </tr>
        </table>
    {{{plugin-sate-sequenceNav}}}
{{</content}}