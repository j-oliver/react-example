// @flow
function findDuplicateNodes(flattenedTree) {
  const titles = flattenedTree.map(node => node.title);

  return titles.reduce((duplicates, title, index) => {
    const d = duplicates;

    if (index !== titles.indexOf(title)) {
      const firstDuplicate = flattenedTree[index];

      if (d[title]) {
        d[title].push(firstDuplicate);
      } else {
        const secondDuplicate = flattenedTree[titles.indexOf(title)];

        d[title] = [firstDuplicate, secondDuplicate];
      }
    }

    return d;
  }, {});
}

function mergeNodes(nodes: Array<Node>) {
  const mergedNode = nodes[0];
  const otherNodes = nodes.slice(1);

  otherNodes.forEach(otherNode => mergedNode.mergeNode(otherNode));
}

export default class Node {
  data: {
    aliases: Array<string>,
    avgViews: number,
    description: string,
    links: Array<string>,
  }
  parents: Array<Node>
  title: string
  children: Array<Node>;

  constructor(page: ?page, parent: ?Node = null) {
    // unfortunately js doesn't support function overloading
    if (page === null || page === undefined) {
      this.data = { aliases: [], avgViews: 0, description: '', links: [] };
      this.parents = [];
      this.title = '';
      this.children = [];
    } else {
      const { aliases, avgViews, description,
        links, relatedPages, title } = page;

      this.data = { aliases, avgViews, description, links };
      this.parents = parent === null ? [] : [parent];
      this.title = title;
      this.children = [];

      this.addChildren(relatedPages);
    }
  }

  isRoot(): boolean { return this.parents === null; }

  isLeaf(): boolean { return this.children.length === 0; }

  addChild(newChild: Node) {
    const childTitles = this.children.map(child => child.title);

    if (childTitles.indexOf(newChild.title) === -1) {
      this.children.push(newChild);
    }
  }

  addParent(parent: Node) {
    const parentTitles = this.parents.map(p => p.title);

    if (parentTitles.indexOf(parent.title) === -1) {
      this.parents.push(parent);
    }
  }

  removeChild(child: Node) {
    const index = this.children.indexOf(child);

    if (index > -1) this.children.splice(index, 1);
  }

  removeParent(parent: Node) {
    const index = this.parents.indexOf(parent);

    if (index > -1) this.parents.splice(index, 1);
  }

  setParents(parents: Array<Node>) { this.parents = parents; }

  addChildren(children: Array<page>) {
    if (children === undefined) return;

    this.children.push(...children.map(child => (
      new Node(child, this)
    )));
  }

  mergeNode(node: Node) {
    if (node === this) return;

    node.children.forEach((child) => {
      this.addChild(child);
      child.addParent(this);
    });

    if (this.isRoot()) return;

    node.parents.forEach((parent) => {
      this.addParent(parent);
      parent.addChild(this);
    });
  }

  findNodeByTitle(title: string): ?Node {
    const queue = [this];

    while (queue.length !== 0) {
      const nextNode = queue.pop();

      if (title === nextNode.title) {
        return nextNode;
      }

      queue.push(...nextNode.children);
    }

    return null;
  }

  nodeExists(title: string): boolean {
    return this.findNodeByTitle(title) !== null;
  }


  traverse(executable: (Node) => any) {
    const queue = [this];

    while (queue.length !== 0) {
      executable(queue.pop());

      if (this.children.length > 0) {
        queue.push(...this.children);
      }
    }
  }

  flattenTree() {
    const flattenedTree = [];
    const queue = [this];

    while (queue.length !== 0) {
      flattenedTree.push(queue.pop());

      if (this.children.length > 0) {
        queue.push(...this.children);
      }
    }

    return flattenedTree;
  }

  mergeDuplicateNodes() {
    const flattenedTree = this.flattenTree();
    const duplicates = findDuplicateNodes(flattenedTree);

    Object.keys(duplicates).forEach(title => mergeNodes(duplicates[title]));
  }
}


type page = {
  aliases: Array<string>,
  avgViews: number,
  description: string,
  links: Array<string>,
  parent: 'root',
  relatedPages: Array<any>,
  title: string
}
