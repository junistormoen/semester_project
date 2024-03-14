function loadTemplate(aTemplateID, aDestElement, aEmptyElement = false) {
    const template = document.getElementById(aTemplateID);

    if (template.content) {
        const clone = template.content.cloneNode(true);
        if(aEmptyElement){
            emptyContainerElement(aDestElement);
        };
        aDestElement.appendChild(clone);
    } else {
        console.log("Browseren støtter ikke template");
    };
};

function emptyContainerElement(aElement){
    let child = aElement.firstChild;
    while(child){
        aElement.removeChild(child);
        child = aElement.firstChild;
    }
}