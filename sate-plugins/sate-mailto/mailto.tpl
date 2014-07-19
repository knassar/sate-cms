<script type="text/javascript" language="javascript">
<!--
    (function(coded, key, linkText, subject) {
        // Email obfuscator script 2.1 by Tim Williams, University of Arizona
        // Random encryption key feature by Andrew Moulden, Site Engineering Ltd
        // This code is freeware provided these four comment lines remain intact
        // A wizard to generate this code is at http://www.jottings.com/obfuscator/

        shift = coded.length;
        link = "";

        for (i=0; i < coded.length; i++) {
            if (key.indexOf(coded.charAt(i)) == -1) {
                ltr = coded.charAt(i);
                link += (ltr);
            }
            else {
                ltr = (key.indexOf(coded.charAt(i))-shift+key.length) % key.length;
                link += (key.charAt(ltr));
            }
        }
        if (!linkText || linkText.length == 0) {
            linkText = link;
        }
        if (subject) {
            link += "?subject=" + subject;
        }
        document.write('<a href="mailto:'+link+'" classes="{{composedClasses}}">'+linkText+'</a>');
    })("{{{coded}}}", "{{{cipher}}}", "{{linkText}}", "{{subject}}");
-->
</script>{{#noScriptText}}<noscript classes="{{composedClasses}}">{{noScriptText}}</noscript>{{/noScriptText}}