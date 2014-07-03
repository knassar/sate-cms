@intro:

Sate is a Node.js command-line-application that is run with the following syntax:

<pre class="cli">
<div class="line"><span class="dir-prompt">~</span>sate [directive] [flags]</div>
</pre>

Sate supports the following directives:

@content:

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
        <td class="code">
            [help](#help)
        </td>
        <td>
            Prints out sate help.
        </td>
    </tr>
    <tr>
        <td class="code">
            [docs](#docs)
        </td>
        <td>
            Installs the Sate Documentation as a Sate website at `/tmp/sate-cms-docs`, and starts the Sate webserver using `run`.
        </td>
    </tr>
    <tr>
        <td class="code">
            [create](#create)
        </td>
        <td>
            Generates a boiler-plate Sate website.
        </td>
    </tr>
    <tr>
        <td class="code">
            [update](#update)
        </td>
        <td>
            Update Sate plugins in an existing Sate website.
        </td>
    </tr>
    <tr>
        <td class="code">
            [develop](#develop)
        </td>
        <td>
            Starts a stateless webserver which serves website page requests by re-evaluating all website sources on each request. This is useful when developing site content, as individual pages can be tested by reloading the browser page with each tweak.
        </td>
    </tr>
    <tr>
        <td class="code">
            [run](#run)
        </td>
        <td>
            Starts a web-server which serves website page requests. This differs from 'develop' in that the website sources are evaluated only once at server-start time. The server must be restarted for source changes to have any affect. **This directive is experimental, and should not be used in a production environment**
        </td>
    </tr>
    <tr>
        <td class="code">
            [deploy](#deploy)
        </td>
        <td>
            Evaluates all website sources and generates the entire website as static pages for serving from Apache, Nginx, or other web server. Use this in production for highest performance.
        </td>
    </tr>
    <tr>
        <td class="code">
            [analyze](#analyze)
        </td>
        <td>
            Evaluate all website sources just as `run` or `deploy` without producing any artifacts or server processes. Returns a report on any fatal or non-fatal issues found, such as un-parseable config or missing page content.
        </td>
    </tr>
</table>

Each directive described above is invoked with required or optional arguments. These are described below:


## <a name="help">Help</a>

Sate help can be invoked two ways. You can use `help` as a Sate directive to emit general directive help:

<pre class="cli">
<div class="line"><span class="dir-prompt">~</span>sate help</div>
</pre>

If you follow `help` with the name of another directive, or use the `-h` or `--help` flags on any directive, Sate will emit help specific to that directive:

<pre class="cli">
<div class="line"><span class="dir-prompt">~</span>sate help develop</div>
</pre>

<pre class="cli">
<div class="line"><span class="dir-prompt">~</span>sate develop -h</div>
</pre>


## <a name="docs">Docs</a>

The `docs` directive installs the Sate docs website and starts a webserver at `localhost:4000` to serve it. The following flags can be passed to the `docs` directive:

<table>
    <tr>
        <th>
            Flag
        </th>
        <th>
            Example
        </th>
        <th>
            Explanation
        </th>
    </tr>
    <tr>
        <td class="nowrap code">
            -p [port]<br>
            --port [port]
        </td>
        <td class="nowrap">
            Port
        </td>
        <td>
            Change the port on which to serve the Docs website. Defaults to `4000`
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            -t [path]<br>
            --target [path]
        </td>
        <td class="nowrap">
            Documentation Target Path
        </td>
        <td>
            Change the filesystem path at which to install the Docs website. Defaults to `/tmp/sate-cms-docs`
        </td>
    </tr>
</table>


## <a name="create">Create</a>

The `create` directive installs a new Sate boilerplate website at the provided path. The following flags can be passed to the `create` directive:

<table>
    <tr>
        <th>
            Flag
        </th>
        <th>
            Example
        </th>
        <th>
            Explanation
        </th>
    </tr>
    <tr>
        <td class="nowrap code">
            --html
        </td>
        <td class="nowrap">
            HTML
        </td>
        <td>
            Format the generated boilerplate content as HTML. This is the default.
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            --md<br>
            --markdown
        </td>
        <td class="nowrap">
            Markdown
        </td>
        <td>
            Format the generated boilerplate content as Markdown
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            --clean
        </td>
        <td class="nowrap">
            Clean
        </td>
        <td>
            Delete all files and subdirectories at the `create` target before setting up the website. **This flag is destructive**. Only use the `--clean` flag if you know any files at the target can be permanently deleted.
        </td>
    </tr>
</table>



## <a name="update">Update</a>

The `udpate` directive updates or re-installs Sate plugins for the website at the provided path. This is helpful especially after updating the Sate package, or if you accidentally delete a plugin. The following flags can be passed to the `update` directive:

<table>
    <tr>
        <th>
            Flag
        </th>
        <th>
            Example
        </th>
        <th>
            Explanation
        </th>
    </tr>
    <tr>
        <td class="nowrap code">
            -s [path]<br>
            --site [path]
        </td>
        <td class="nowrap">
            Site Path
        </td>
        <td>
            Provide a path to the Sate website. If not provided, assumes `./`
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            -a<br>
            --add-missing
        </td>
        <td class="nowrap">
            Add Missing
        </td>
        <td>
            Add any standard Sate plugins not found in your site.
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            -f<br>
            --force
        </td>
        <td class="nowrap">
            Force Update
        </td>
        <td>
            Force-update all built-in plugins, regardless of their version.
        </td>
    </tr>
</table>



## <a name="develop">Develop</a>

The `develop` directive starts a stateless webserver which serves website page requests by re-evaluating all website sources on each request. Most of your time with Sate will be spent in this mode, writing content.

<table>
    <tr>
        <th>
            Flag
        </th>
        <th>
            Example
        </th>
        <th>
            Explanation
        </th>
    </tr>
    <tr>
        <td class="nowrap code">
            -s [path]<br>
            --site [path]
        </td>
        <td class="nowrap">
            Site Path
        </td>
        <td>
            Provide a path to the Sate website. If not provided, assumes `./`
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            -p [port]<br>
            --port [port]
        </td>
        <td class="nowrap">
            Port
        </td>
        <td>
            Change the port on which to serve the website. Defaults to `3000`
        </td>
    </tr>
</table>



## <a name="run">Run</a> 

The `run` directive compiles the website and starts a webserver to serve page requests. This is an experimental feature and should not be relied on for production deployment.

<span class="warn">This Directive is Experimental</span>

<table>
    <tr>
        <th>
            Flag
        </th>
        <th>
            Example
        </th>
        <th>
            Explanation
        </th>
    </tr>
    <tr>
        <td class="nowrap code">
            -s [path]<br>
            --site [path]
        </td>
        <td class="nowrap">
            Site Path
        </td>
        <td>
            Provide a path to the Sate website. If not provided, assumes `./`
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            -p [port]<br>
            --port [port]
        </td>
        <td class="nowrap">
            Port
        </td>
        <td>
            Change the port on which to serve the website. Defaults to `3000`
        </td>
    </tr>
</table>




## <a name="deploy">Deploy</a>

The `deploy` directive compiles and saves the entire website into static HTML for serving from Apache, Nginix, or other webservers. Typically, you would follow this directive with an `scp` or `rsync` to your webserver.

<table>
    <tr>
        <th>
            Flag
        </th>
        <th>
            Example
        </th>
        <th>
            Explanation
        </th>
    </tr>
    <tr>
        <td class="nowrap code">
            -s [path]<br>
            --site [path]
        </td>
        <td class="nowrap">
            Site Path
        </td>
        <td>
            Provide a path to the Sate website. If not provided, assumes `./`
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            -t [path]<br>
            --target [path]
        </td>
        <td class="nowrap">
            Target Path
        </td>
        <td>
            The target destination of the generated website. If not provided, defaults to `../sate-build/[site path]/`
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            -o<br>
            --overwrite
        </td>
        <td class="nowrap">
            Overwrite
        </td>
        <td>
            Overwrites any files at the `deploy` target when generating the website. This flag differs from `--clean` in that files in the target directory that are not generated by Sate will be preserved.
        </td>
    </tr>
    <tr>
        <td class="nowrap code">
            --clean
        </td>
        <td class="nowrap">
            Clean
        </td>
        <td>
            Delete all files at the `deploy` target before generating the website. **This flag is destructive**. Only use the `--clean` flag if you know any files at the target can be permanently deleted.
        </td>
    </tr>
</table>


## <a name="analyze">Analyze</a> 

The `analyze` directive compiles the website without creating any new resources, and emits an output log giving details about the site.

<span class="todo">This Directive is unimplemented</span>

{{!
<table>
    <tr>
        <th>
            Flag
        </th>
        <th>
            Example
        </th>
        <th>
            Explanation
        </th>
    </tr>
    <tr>
        <td class="nowrap code">
            -s [path]<br>
            --site [path]
        </td>
        <td class="nowrap">
            Site Path
        </td>
        <td>
            Provide a path to the Sate website. If not provided, assumes `./`
        </td>
    </tr>
</table>
}}

{{{plugin-sate-sequenceNav}}}

