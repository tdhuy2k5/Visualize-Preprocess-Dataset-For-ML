import uuid


class TreeNode:
    def __init__(self, samples: int, dist):
        self.id = uuid.uuid4()
        self.samples = samples
        self.dist = dist

    def set_parent(self, id):
        self.parent = id


class SplitNode(TreeNode):
    def __init__(
        self,
        samples,
        dist,
        feature,
        threshold,
        gini,
        gini_history,
        left,
        right,
    ):
        super().__init__(samples, dist)

        self.feature = feature
        self.threshold = threshold
        self.gini = gini
        self.gini_history = gini_history

        self.left = left
        self.right = right

    def set_right(self, right):
        self.right = right

    def set_left(self, left):
        self.left = left


class LeafNode(TreeNode):
    def __init__(self, samples, dist, data):
        super().__init__(samples, dist)

        self.data = data
