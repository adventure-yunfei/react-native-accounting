/**
 * Convert tree data from flat to tree structure
 * E.g. [{_id:1,parentId:null}, {_id:2,parentId:1}] => [{_id:1,children:[{_id:2}]}]
 */
export default function flatToTree(data, genItem = item => item) {
  const roots = [];
  const rootMap = {};
  data.forEach((item) => {
    if (!item.parentId) {
      const rootItem = {
        ...genItem(item),
        children: []
      };
      roots.push(rootItem);
      rootMap[item._id] = rootItem;
    }
  });
  data.forEach((item) => {
    if (item.parentId) {
      rootMap[item.parentId].children.push(genItem(item));
    }
  });
  return roots;
}
