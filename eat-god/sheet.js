
const artList = Object.keys(rebelliousArts);
const artDetails = Object.values(rebelliousArts);
const creedList = Object.keys(creeds)
const creedDetails = Object.values(creeds);
const traitList = Object.keys(traits);
const traitDetails = Object.values(traits);
const mundaneItems = [];
mundaneItems.push(...tools);
mundaneItems.push(...food);
const flaws = adjectives.flaws;
const talents = adjectives.talents;


document.getElementById("customCreed").value = "Select your creed from the dropdown or write your own..."
document.getElementById("inventory").value = ""

function dX(x) {
    return Math.floor(Math.random() * x)
}
function NdX(n, x) {
    let result = 0;
    while (n > 0) {
        result += dX(x)
        n--;
    }
    return result;
}
// pass an empty list to clear
function fillSelector(id, list) {
    let s = document.getElementById(id);
    s.options.length = 0;
    if (list.length == 0) {return false;}
    for (let i = 0; i < list.length; i++) {
        let o = document.createElement('option');
        o.value = list[i];
        o.innerHTML = list[i];
        s.appendChild(o);
    }
}

// returns 2 unique integers [0-n) including any in Z
function pick2(n, z) {
    if (z.length > 1) {return z;}
    if (z.length == 1) {var a = z[0];}
    else {var a = dX(n);}
    let b = dX(n - 1);
    if (b >= a) {return [a, b + 1];}
    else {return [a, b]}
}

// returns 3 unique integers [0-n) including any in Z
function pick3(n, z) {
    if (z.length > 2) {return z;}
    if (z.length == 2) {var [a,b] = z;}
    else {var [a, b] = pick2(n, z);}
    let c = dX(n - 2);
    if (c >= a && c >= b) {return [a, b, c+2];}
    if (c >= a || c >= b) {
        if (c + 1 >= a && c + 1 >= b) {return [a, b, c + 2];}
        return [a, b, c + 1];
        }
    return [a, b, c];
}

function selectRand(id, options, exclude) {
    exclude.sort();
    let s = document.getElementById(id);
    let len = options.length - exclude.length;
    let pick = dX(len);
    for (let i = 0;  i < exclude.length; i ++) {
        if (pick >= exclude[i]) {pick++;}
        else {break;}
    }
    s.value = options[pick];
}

function randomHeight() {
    document.getElementById("height").value = 12 + NdX(3, 6);
}

function randomWeight() {
    document.getElementById("weight").value = 10 + NdX(2, 12);
}

function randomSize() {
    randomHeight();
    randomWeight();
}

function resetStress() {
    document.getElementById("stress").value = "";
}

function resetObs() {
    document.getElementById("obstinancy").value = "3";
}

function resetSnO() {
    resetStress();
    resetObs();
}

function clearFacets() {
    let boxesToClear = ["ethos", "pathos", "logos"];
    for (let i = 0; i < boxesToClear.length; i++) {
        document.getElementById(boxesToClear[i]).value = "";
    }
    let dropdowns = ["ethosAdj", "pathosAdj", "logosAdj"];
    for (let i = 0; i < dropdowns.length; i++) {
        document.getElementById(dropdowns[i]).value = " ";
    }
    fsumCheck();
    document.getElementById("facetWarn").setAttribute("hidden", false);
}

function randomFacets() {
    clearFacets();
    let maxF = 6 + dX(2);
    let minF = 3 + dX(2);
    let midF = 15 - maxF - minF;
    let array = [maxF, midF, minF];
    [pi, ei, li] = pick3(3, [])
    document.getElementById("logos").value = array[li];
    document.getElementById("pathos").value = array[pi];
    document.getElementById("ethos").value = array[ei];
    fsumCheck()
}

function fsumCheck() {
    let epl = [parseInt(document.getElementById("ethos").value),
        parseInt(document.getElementById("pathos").value),
        parseInt(document.getElementById("logos").value)];
    let sum = epl[0] + epl[1] + epl[2]
    let min = Math.min(...epl);
    let max = Math.max(...epl);
    if (min < 3 || max > 7 || sum != 15 || min == max) {
        document.getElementById("facetWarn").removeAttribute("hidden");
    }
    else {
        document.getElementById("facetWarn").setAttribute("hidden", false);
    }
    let ids = ["ethosAdj", "pathosAdj", "logosAdj"];
    let spans = ["ethosMore", "pathosMore", "logosMore"]
    for (let i = 0; i < 3; i++) {
    
        if (epl[i] > 5) {
            let selector = document.getElementById(ids[i]);
            v = selector.value;
            fillSelector(ids[i], talents[i]);
            document.getElementById(spans[i]).removeAttribute("hidden");
            selector.value = v;
            if (selector.value.length < 1) { // catches both "" and " "
                selectRand(ids[i], talents[i], [0])
            }
        }
        else if (epl[i] < 5) {
            let selector = document.getElementById(ids[i]);
            v = selector.value;
            fillSelector(ids[i], flaws[i]);
            document.getElementById(spans[i]).removeAttribute("hidden");
            selector.value = v;
            if (selector.value.length < 1) { // catches both "" and " "
                selectRand(ids[i], flaws[i], [0])
            }
        }
        else {
            fillSelector(ids[i], []);
            document.getElementById(spans[i]).setAttribute("hidden", false);
        }
    }
}

function randAdj(id) {
    var s = document.getElementById(id);
    var opts = [];
    Array.apply(null, s.options).forEach(
        option => {opts.push(option.value);}
    );
    selectRand(id, opts, [0,s.options.selectedIndex]);
}


function randomFeatures() {
    [a,b,c] = pick3(features.length - 1, []);
    document.getElementById("selectF1").value = features[a + 1];
    document.getElementById("selectF2").value = features[b + 1];
    document.getElementById("selectF3").value = features[c + 1];
    return false;
}

function randF(id) {
    let e = []
    if (id != "selectF1") {
        e.push(features.indexOf(document.getElementById("selectF1").value));
    }
    if (id != "selectF2") {
        e.push(features.indexOf(document.getElementById("selectF2").value));
    }
    if (id != "selectF3") {
        e.push(features.indexOf(document.getElementById("selectF3").value));
    }    
    newFeats = pick3(features.length, e)
    document.getElementById(id).value = features[newFeats[2]];
}

function randomTraits() {
    [a,b,c] = pick3(traitList.length - 1, []);
    document.getElementById("selectT1").value = traitList[a + 1];
    document.getElementById("selectT2").value = traitList[b + 1];
    document.getElementById("selectT3").value = traitList[c + 1];
    for (let i = 1; i < 4; i++) {
        updateTrait("selectT" + i)
    }
    return false;
}

function randT(id) {
    let e = []
    if (id != "selectT1") {
        e.push(traitList.indexOf(
            document.getElementById("selectT1").value) - 1);
    }
    if (id != "selectT2") {
        e.push(traitList.indexOf(
            document.getElementById("selectT2").value) - 1);
    }
    if (id != "selectT3") {
        e.push(traitList.indexOf(
            document.getElementById("selectT3").value) - 1);
    }    
    newTraits = pick3(traitList.length - 1, e)
    document.getElementById(id).value = traitList[newTraits[2] + 1];
    updateTrait(id);
}

function updateTrait(id) {
    //console.log(id)
    t = document.getElementById(id);
    Tx = id.slice(-2);
    deets = traitDetails[traitList.indexOf(t.value)];
    para = document.getElementById("explain" + Tx);
    if (deets.effort == null) {para.innerHTML = deets.text;}
    else {para.innerHTML = deets.text + " <i>With effort,</i> " + deets.effort;}
    if (deets.options != null) {
        let p = document.getElementById("more" + Tx);
        p.removeAttribute("hidden");
        fillSelector("opt" + Tx, deets.options)
    }
    else {
        let p = document.getElementById("more" + Tx);
        p.setAttribute("hidden", false);
        fillSelector("opt" + Tx, [])
    }
    ids = ["selectT1", "selectT2", "selectT3"];
    for (let i  = 0; i < ids.length; i++) {
        if (document.getElementById(ids[i]).value == "Unusual Size") {
        
        }
        else {}
    }
}

function randOpt(id) {
    Tx = id.slice(-2)
    let opts = traitDetails[traitList.indexOf(
        document.getElementById("select" + Tx).value
    )].options;
    let i = dX(opts.length - 1);
    if (i >= opts.indexOf(document.getElementById(id).value)) {i++;}
    document.getElementById(id).value = opts[i]
}

function randomArt() {
    let i = dX(artList.length - 1) + 1;
    var art = artList[i];
    let detail = document.getElementById("artDetail")
    detail.innerHTML = artDetails[i];
    document.getElementById("selectArt").value = art;
}

document.getElementById("selectArt").addEventListener("change", function(event) {
    detail = document.getElementById("artDetail");
    let detailText = artDetails[artList.indexOf(this.value)];
    detail.innerHTML = detailText;
});

function randomCreed() {
    let i = dX(creedList.length - 2) + 1;
    var creed = creedList[i];
    document.getElementById("selectCreed").value = creed;
    customCreed = document.getElementById("customCreed");
    customCreed.value = creedDetails[i];
}

function randomItems() {
    let items = [];
    if (dX(2) == 1) {
        let trio = pick3(mundaneItems.length, []);
        for (let i = 0; i < 3; i++) {
            items.push(mundaneItems[trio[i]])
        }
    }
    else {
        items.push("a Catalyst")
        let duo = pick2(mundaneItems.length, []);
        for (let i = 0; i < 2; i++) {
            items.push(mundaneItems[duo[i]])
        }
    }
    list = items[1] + ", " + items[2] + ", and " + items[0]; //lmao i'm lazy sorry
    document.getElementById("inventory").value = list;
}

document.getElementById("selectCreed").addEventListener("change", function(event) {
    document.getElementById("customCreed").value = creedDetails[creedList.indexOf(this.value)];
});


function clearAll() {
    boxesToClear = ["name", "weight", "height", "inventory", "customCreed"];
    for (let i = 0; i < boxesToClear.length; i++) {
        document.getElementById(boxesToClear[i]).value = "";
    }
    dropdowns = ["selectT1", "selectT2", "selectT3", "selectArt", "selectCreed", "selectF1", "selectF2", "selectF3"]
    for (let i = 0; i < dropdowns.length; i++) {
        document.getElementById(dropdowns[i]).value = " ";
        if (dropdowns[i].slice(0, 7) == "selectT") {updateTrait(dropdowns[i]);}
    }
    clearFacets();
    document.getElementById("artDetail").innerHTML = ""
    resetSnO();
    document.getElementById("customFs").value = "Need inspiration? Roll above for random features!"
}

function randomAll() {
    clearAll();
    randomSize();
    resetSnO();
    randomFacets();
    randomTraits();
    randomArt();
    randomCreed();
    randomFeatures();
    document.getElementById("customFs").value = "Describe what rough beast combines these features!"
    randomItems();
}

// on load...
fillSelector("selectArt", artList);
fillSelector("selectF1", features);
fillSelector("selectF2", features);
fillSelector("selectF3", features);
fillSelector("selectT1", traitList);
fillSelector("selectT2", traitList);
fillSelector("selectT3", traitList);
fillSelector("selectCreed", creedList);
clearAll();