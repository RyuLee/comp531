//
// Inclass Virtual DOM Exercise
// ============================
//
// You need to implement createElement() and updateElement()
//
;(function(exports) {

'use strict'

function h(tag, props, ...children) {
    return { tag, props: props ? props : { }, 
        children: Array.isArray(children[0]) ? children[0] : children }
}
function eventHandler(evt) {
                return function(event){
                
                evt
                
                update()
            }
            }
function createElement(node) {
	console.log('Create element called for', node)

    var e = document.createElement(node.tag);
    if(node.tag === "button"||node.tag === "i"){
        //console.log(node)
        e.addEventListener('click', eventHandler(node.props["onClick"]))
    }
    for (var property in node.props) {
    if (node.props.hasOwnProperty(property)) {
        if(property!="onClick")
        e.setAttribute(property,node.props[property])
    }
}
    console.log(typeof(node.children[0])==='string')
    if(node.children.length>0){
        if(Array.isArray(node.children[0])){
        e.appendChild([node.children[0].map(createElement)])
    }else if(typeof(node.children[0])==='string'){
        e.innerHTML = node.children[0]
    }else if(typeof(node.children[0])!='string'&&!Array.isArray(node.children[0])){
        try{
            for(var i = 0; i < node.children.length;i ++){
                e.appendChild(createElement(node.children[i]))       
            }
        
        }catch(error){console.log(error)}
    }
}
    
	// create the element and return it to the caller
	// the node might have event listeners that need to be registered
	// the node might have children that need to be created as well
	console.log(e)
    return e
}

function changed(node1, node2) {
    return typeof node1 !== typeof node2 ||
            (typeof node1 === 'string' && node1 !== node2) ||
            node1.tag !== node2.tag ||
            (node1.props && node2.props && 
            	node1.props.id && node2.props.id && 
            	node1.props.id != node2.props.id)
}

function updateElement(parent, newNode, oldNode, index=0) {
	// index will be needed when you traverse children
	// add the new node to the parent DOM element if
	// the new node is different from the old node 
	// at the same location in the DOM.
	// ideally we also handle inserts, but ignore that functionality for now.

    if (!oldNode) {
        parent.appendChild(createElement(newNode))
    } else {
    	console.log('update element that may have changed')

    	// be sure to also update the children!
    }
}

const deepCopy = (obj) => {
    if (obj === null || typeof(obj) !== 'object')
        return obj;
    const props = {}
    if (obj.props) {
        for (let p in obj.props) {
            props[p] = obj.props[p]
        }
    }
    return h(obj.tag, props,
        Array.isArray(obj.children) ? obj.children.map(deepCopy) : obj.children)
}

const update = () => requestAnimationFrame(() => {
	// compare the current vdom with the original vdom for updates
    updateElement(h.mounted.root, h.mounted.current, h.mounted.original)
    h.mounted.original = deepCopy(h.mounted.current)
})

h.mount = (root, component) => {
    // we keep a copy of the original virtual DOM so we can diff it later for updates
    const originalComponent = deepCopy(component)
    h.mounted = { root: root, current: component, original: originalComponent }
    updateElement(root, originalComponent)
}

exports.h = h

})(window);