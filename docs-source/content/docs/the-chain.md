{
    "extraStyles": [
        "/styles/sate-chain.css"
    ]
}
@intro:

The Chain is a structured inheritance sequence which allows Sate pages to be functional with as little explicit definition as possible.


@content:

Any properties defined at each link in the Chain get overridden by subsequent links. Below is a basic diagram of the Chain in a Sate website.

<ol class="the-chain-diagram">
    <li><span>Sate Defaults</span></li>
    <li><span>`pageDefaults` in `website.json`</span></li>
    <li><span>`JSON` data in page content file</span></li>
</ol>

## Property Chaining

The way individual properties are handled by the Chain sequence depend on their type:

### Primitive Types  <span class="type string">String</span> | <span class="type boolean">Boolean</span> | <span class="type number">Number</span> | <span class="type date">Date</span> | <span class="type sate">Sate `enum`</span>

These types are merged by overwrite. The value on the right-hand link overrides the left-hand link.

### Arrays  <span class="type array">Array</span>

Arrays are concatenated and uniqued. So, if the left-hand link in the chain has `[A, B, C]` and the right-hand link has `[X, Y, B]`, the resulting chained value will be `[A, B, C, X, Y]`.

This particular handling of Arrays is what allows a page to specify additional styles, scripts, plugins, etc, without having to redeclare items higher up in the chain.

### Objects  <span class="type object">Object</span>

JSON Objects (or Dictionaries) are merged sequentially, with each value property of the dictionary being handled according to these type rules. 

### Type Conflicts

When the left-hand and right-hand property value types differ, the right-hand value overwrites the left-hand.


## Specialized Chaining Rules

There are some variations on the basic Chain of inheritance which apply to specific properties. In these Docs, you'll see a Chain diagram like the one above when a specific variation of the Chain is used.


{{{plugin-sate-sequenceNav}}}
