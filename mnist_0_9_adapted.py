import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import matplotlib.pyplot as plt


def load_data(sample_count=2000, target_size=(20, 20)):
    """Load MNIST, resize to target_size, flatten to vectors."""
    (x_train, y_train), _ = tf.keras.datasets.mnist.load_data()
    x_train = x_train.astype("float32") / 255.0

    x_train = x_train[:sample_count]
    y_train = y_train[:sample_count]

    x_resized = tf.image.resize(x_train[..., np.newaxis], target_size).numpy()
    x_flat = x_resized.reshape(sample_count, -1)
    return x_flat, y_train


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


def softmax(z):
    z = z - np.max(z)
    exp_z = np.exp(z)
    return exp_z / np.sum(exp_z)


def softmax_batch(z):
    z = z - np.max(z, axis=1, keepdims=True)
    exp_z = np.exp(z)
    return exp_z / np.sum(exp_z, axis=1, keepdims=True)


def my_dense(a_in, W, b, g):
    units = W.shape[1]
    a_out = np.zeros(units)
    for j in range(units):
        w = W[:, j]
        z = np.dot(w, a_in) + b[j]
        a_out[j] = g(z)
    return a_out


def my_sequential(x, W1, b1, W2, b2, W3, b3):
    a1 = my_dense(x, W1, b1, sigmoid)
    a2 = my_dense(a1, W2, b2, sigmoid)
    a3 = my_dense(a2, W3, b3, softmax)
    return a3


def my_dense_v(A_in, W, b, g):
    z = np.matmul(A_in, W) + b
    return g(z)


def my_sequential_v(X, W1, b1, W2, b2, W3, b3):
    A1 = my_dense_v(X, W1, b1, sigmoid)
    A2 = my_dense_v(A1, W2, b2, sigmoid)
    A3 = my_dense_v(A2, W3, b3, softmax_batch)
    return A3


X, y = load_data()

model = Sequential(
    [
        tf.keras.Input(shape=(400,)),
        Dense(25, activation="sigmoid"),
        Dense(15, activation="sigmoid"),
        Dense(10, activation="softmax"),
    ],
    name="my_model",
)

model.compile(
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    optimizer=tf.keras.optimizers.Adam(0.001),
    metrics=["accuracy"],
)

model.fit(X, y, epochs=20)

# Predict a single example
prediction = model.predict(X[0].reshape(1, 400))
print("Predicted digit:", int(np.argmax(prediction, axis=1)[0]))

# Copy weights and validate NumPy forward pass
layer1, layer2, layer3 = model.layers
W1_tmp, b1_tmp = layer1.get_weights()
W2_tmp, b2_tmp = layer2.get_weights()
W3_tmp, b3_tmp = layer3.get_weights()

numpy_pred = my_sequential(X[0], W1_tmp, b1_tmp, W2_tmp, b2_tmp, W3_tmp, b3_tmp)
print("NumPy predicted digit:", int(np.argmax(numpy_pred)))

# Vectorized NumPy predictions for the full batch
numpy_preds = my_sequential_v(X, W1_tmp, b1_tmp, W2_tmp, b2_tmp, W3_tmp, b3_tmp)
numpy_labels = np.argmax(numpy_preds, axis=1)
print("NumPy accuracy:", np.mean(numpy_labels == y))

# Optional visualization
plt.imshow(X[0].reshape(20, 20), cmap="gray")
plt.title(f"Label: {y[0]}, Pred: {np.argmax(prediction)}")
plt.axis("off")
plt.show()
