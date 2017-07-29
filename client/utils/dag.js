// @flow
export default class Node {
  data: {
    aliases: Array<string>,
    avgViews: number,
    description: string,
    links: Array<string>,
  }
  parent: 'root' | Node
  title: string
  children: Array<Node>;

  constructor(page: page) {
    const { aliases, avgViews, description,
      links, parent, relatedPages, title } = page;

    this.data = { aliases, avgViews, description, links };
    this.parent = parent;
    this.title = title;
    this.children = [];

    this.addChildren(relatedPages);
  }

  isRoot(): boolean {
    return this.parent === undefined;
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  addChildren(children: Array<page>) {
    if (children === undefined) return;

    this.children.push(...children.map(child => (
      new Node(child)
    )));
  }

  removeChildWithTitle(title: string) {
    this.children = this.children.filter(childNode => (
      childNode.title !== title
    ));
  }

  addChild(node: Node) {
    this.children.push(node);
  }

  nodeExists(title: string) {
    if (title === this.title) {
      return true;
    }

    return this.children.some(childNode => (
      childNode.nodeExists(title)
    ));
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
}

type page = {
  aliases: Array<string>,
  avgViews: number,
  description: string,
  links: Array<string>,
  parent: 'root' | Node,
  relatedPages: Array<any>,
  title: string
}
