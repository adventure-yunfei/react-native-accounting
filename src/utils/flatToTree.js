/**
 * Convert tree data from flat to tree structure
 * E.g. [{_id:1,parentId:null}, {_id:2,parentId:1}] => [{_id:1,children:[{_id:2}]}]
 */
export default function flatToTree(
  data,
  genItem = item => Object.assign({}, item),
  { fullLevel = false } = {}
) {
  const roots = [];
  const nodeMap = {};
  let hasMultiLevel = false;
  data.forEach((item) => {
    const { _id, parentId } = item;
    if (parentId) {
      const parentNode = nodeMap[parentId] = nodeMap[parentId] || {};
      parentNode.children = parentNode.children || [];
      const newItem = genItem(item);
      if (nodeMap[_id]) {
        hasMultiLevel = true;
        Object.assign(newItem, nodeMap[_id]);
      }
      parentNode.children.push(newItem);
    } else {
      if (nodeMap[_id]) {
        roots.push(Object.assign(nodeMap[_id], genItem(item)));
      } else {
        const newRootItem = genItem(item);
        newRootItem.children = [];
        roots.push(newRootItem);
        nodeMap[_id] = newRootItem;
      }
    }
  });

  if (!fullLevel && hasMultiLevel) {
    const getLeafChildren = node => node.children.reduce((acc, childNode) => {
      if (childNode.children) {
        acc.push(...getLeafChildren(childNode));
      } else {
        acc.push(childNode);
      }
      return acc;
    }, []);
    roots.children = roots.children.map(getLeafChildren);
  }

  return roots;
}
