{
    "name": "Creating a Sate site"
}

@intro:

The first Sate command you will run is <code>create</code>. Sate <code>create</code> establishes all the scaffolding and boilerplate necessary to drive a Sate website. Pass the <code>create</code> command either an empty directory, or the name of a directory you want Sate to create.


@content:

<pre class="cli">
<div class="line"><span class="dir-prompt">~</span>sate create ./my-sate-website</div>
</pre>

After <code>create</code> does its thing, <code>cd</code> into the new directory and check out the structure of your new Sate website.

<pre class="cli">
<div class="line"><span class="dir-prompt">~</span>cd ./my-sate-website</div>
<div class="line"><span class="dir-prompt">my-sate-website</span>ls</div>
</pre>

The directory structure you'll see is something like this:

<pre class="ls cli">
    ./
        website.json
        /content
            index.html 
            about.html
        /images
        /styles
        /sate-cms
            /error
            /templates
            /plugins
</pre>

We'll go deeper into this structure in the next section. For now, try out this website by using the <code>develop</code> command:

<pre class="cli">
<div class="line"><span class="dir-prompt">my-sate-website</span>sate develop</div>
</pre>

You'll see a log of console output telling you that Sate is compiling the site. Then you'll see Sate starting the development webserver, and listening on port 3000. If you need to change the default port, use the <code>-p</code> flag with the <code>develop</code> command. 

Now point your browser at <code>http://localhost:3000</code> (or whatever port you're using), and you'll see the Sate boilerplate website.

{{{plugin-sate-sequenceNav}}}
