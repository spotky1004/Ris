export default class TagsManager {
  private tags: Set<string>
  
  constructor(...tags: string[]) {
    this.tags = new Set();
    for (const tag of tags) {
      this.add(tag);
    }
  }

  add(tag: string) {
    this.tags.add(tag);
  }

  remove(tag: string) {
    return this.tags.delete(tag);
  }

  has(tag: string | string[] | RegExp) {
    if (typeof tag === "string") {
      return this.tags.has(tag);
    } else if (tag instanceof RegExp) {
      for (const t of this.entries()) {
        const has = tag.test(t);
        if (has) return true;
      }
      return false;
    } else {
      for (const t of tag) {
        const has = this.tags.has(t);
        if (has) return true;
      }
      return false;
    }
  }

  entries() {
    return [...this.tags.values()];
  }
}
