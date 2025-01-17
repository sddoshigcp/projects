from sklearn.svm import LinearSVC
import numpy as np
import cv2 as cv
import PIL
from PIL import Image
class Model:

    # initialize model
    def __init__(self):
        # using LinearSVC, in production-level project should use neural network
        self.model = LinearSVC()

    # train model
    def train_model(self, counters):
        img_list = np.array([])
        class_list = np.array([])

        # first class
        for i in range(1, counters[0]):
            img = cv.imread(f'1/frame{i}.jpg')[:, :, 0]
            img = img.reshape(16950)
            img_list = np.append(img_list, [img])
            class_list = np.append(class_list, 1)

        # second class
        for i in range(1, counters[1]):
            img = cv.imread(f'2/frame{i}.jpg')[:, :, 0]
            img = img.reshape(16950)
            img_list = np.append(img_list, [img])
            class_list = np.append(class_list, 2)

        img_list = img_list.reshape(counters[0] - 1 + counters[1] - 1, 16950)

        # use linear svc to fit image and class list to model
        self.model.fit(img_list, class_list)
        print("Model successfully trained.")

    def predict(self, frame):
        frame = frame[1]
        cv.imwrite("frame.jpg", cv.cvtColor(frame, cv.COLOR_RGB2GRAY))
        img = PIL.Image.open("frame.jpg")
        img.thumbnail((150, 150), PIL.Image.Resampling.LANCZOS)
        img.save("frame.jpg")

        img = cv.imread('frame.jpg')[:, :, 0]
        img = img.reshape(16950)

        # predict class of image from current frame  using model
        prediction = self.model.predict([img])

        return prediction[0]