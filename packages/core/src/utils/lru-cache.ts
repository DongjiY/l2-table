class Node<TKey, TValue> {
  constructor(
    public key: TKey,
    public value: TValue,
    public next: Node<TKey, TValue> | null = null,
    public prev: Node<TKey, TValue> | null = null
  ) {}
}

export class LRUCache<TKey, TValue> {
  private map: Map<TKey, Node<TKey, TValue>> = new Map();
  private head: Node<TKey, TValue> | null = null;
  private tail: Node<TKey, TValue> | null = null;

  constructor(private readonly capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be greater than 0");
  }

  public get(key: TKey): TValue | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToHead(node);
    return node.value;
  }

  public put(key: TKey, value: TValue): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.moveToHead(existing);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this.addToHead(node);

    if (this.map.size > this.capacity) {
      this.evictTail();
    }
  }

  private evictTail(): void {
    if (!this.tail) {
      return;
    }

    const oldTail = this.tail;
    this.remove(oldTail);
    this.map.delete(oldTail.key);
  }

  private addToHead(node: Node<TKey, TValue>): void {
    node.prev = null;
    node.next = this.head;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private remove(node: Node<TKey, TValue>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    node.next = null;
    node.prev = null;
  }

  private moveToHead(node: Node<TKey, TValue>): void {
    if (node === this.head) return;

    this.remove(node);
    this.addToHead(node);
  }
}
