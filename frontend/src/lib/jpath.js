"use strict";

function _jpath(tree, path, mroot) {
    var branch = tree;
    path.split('/').some(function (node) {
        if (typeof branch === 'undefined' || branch === null)
            return true;
        if (node === '')
            return false;
        if (typeof branch === 'object' && node in branch)
            branch = branch[node];
        else {
            if (node + "s" in mroot || node + "es" in mroot) {
                let nb = [
                    "id_" + node,
                    node + "_id",
                    "id" + node.charAt(0).toUpperCase() + node.substring(1)
                ].find((e) => e in branch);
                if (nb) {
                    if (node + "s" in mroot)
                        node = node + "s";
                    else
                        node = node + "es";
                    const idx = branch[nb];
                    branch = Array.isArray(mroot[node])
                        ? mroot[node].find((e) => e.id == idx)
                        : mroot[node][idx];
                    if (!branch) {
                        branch = null;
                        return true;
                    }
                } else {
                    branch = null;
                    return true;
                }
            } else {
                branch = null;
                return true;
            }
        }
        return false;
    });
    return branch;
}

export default
function jpath(tree) {
    var branch = tree;
    var args = Array.prototype.slice.call(arguments, 1);
    args.some(function (pp) {
        if (typeof pp === 'function' && Array.isArray(branch)) {
            branch = branch.filter(pp);
            if (branch.length == 0) {
                branch = null;
                return true;
            }
        } else {
            branch = _jpath(branch, pp, tree);
        }
        if (branch === null)
            return true;
        return false;
    });
    return branch;
}