import tkinter as tk
from tkinter import simpledialog
import cv2 as cv
import os
import PIL.Image, PIL.ImageTk

# imports from create files
import camera
import model

class App:

    # initialize app
    def __init__(self, window=tk.Tk(), window_title="Camera Classifier"):
        # initialize window variables for GUI
        self.window = window
        self.window_title = window_title

        # variable to keep track of images taken
        self.counters = [1,1]

        # function to create model
        self.model = model.Model()

        # indicator for whether autopredict is on/off
        self.auto_predict = False

        # initialize camera from Camera class
        self.camera = camera.Camera()

        # function to initialize GUI
        self.init_gui()

        self.delay = 15

        # function to update frame
        self.update()

        self.window.attributes('-topmost', True)
        self.window.mainloop()

    def init_gui(self):
        # create GUI canvas
        self.canvas = tk.Canvas(self.window, width=self.camera.width, height=self.camera.height)
        self.canvas.pack()

        # create autopredict button
        self.btn_toggleauto = tk.Button(self.window, text="Auto Prediction", width=50, command=self.auto_predict_toggle)
        self.btn_toggleauto.pack(anchor=tk.CENTER, expand=True)

        # create dialogs to prompt user for item classes
        self.classname_one = simpledialog.askstring("Classname One", "Enter the name of the first class:",
                                                    parent=self.window)
        self.classname_two = simpledialog.askstring("Classname Two", "Enter the name of the second class:",
                                                    parent=self.window)

        # create buttons to save items
        self.btn_class_one = tk.Button(self.window, text=self.classname_one, width=50,
                                       command=lambda: self.save_for_class(1))
        self.btn_class_one.pack(anchor=tk.CENTER, expand=True)

        self.btn_class_two = tk.Button(self.window, text=self.classname_two, width=50,
                                       command=lambda: self.save_for_class(2))
        self.btn_class_two.pack(anchor=tk.CENTER, expand=True)

        # create button to train model
        self.btn_train = tk.Button(self.window, text="Train Model", width=50,
                                   command=lambda: self.model.train_model(self.counters))
        self.btn_train.pack(anchor=tk.CENTER, expand=True)

        # create button to predict item
        self.btn_predict = tk.Button(self.window, text="Predict", width=50, command=self.predict)
        self.btn_predict.pack(anchor=tk.CENTER, expand=True)

        # create button to reset
        self.btn_reset = tk.Button(self.window, text="Reset", width=50, command=self.reset)
        self.btn_reset.pack(anchor=tk.CENTER, expand=True)


        # create button to display predicted item's class
        self.class_label = tk.Label(self.window, text="CLASS")
        self.class_label.config(font=("Arial", 20))
        self.class_label.pack(anchor=tk.CENTER, expand=True)

    # toggle whether autopredict is on or off
    def auto_predict_toggle(self):
        self.auto_predict = not self.auto_predict

    # takes snapshot of current camera frame, saves file in correct directory based on
    # selected class
    def save_for_class(self, class_num):
        # get frame from camera
        ret, frame = self.camera.get_frame()

        # create image directories if they don't exist
        if not os.path.exists('1'):
            os.mkdir('1')
        if not os.path.exists('2'):
            os.mkdir('2')

        # write image to corresponding directory
        cv.imwrite(f'{class_num}/frame{self.counters[class_num - 1]}.jpg',
                   cv.cvtColor(frame, cv.COLOR_RGB2GRAY))

        # resize image to reduce training time and storage space
        img = PIL.Image.open(f'{class_num}/frame{self.counters[class_num - 1]}.jpg')
        img.thumbnail((150, 150), PIL.Image.Resampling.LANCZOS)

        # save resized image
        img.save(f'{class_num}/frame{self.counters[class_num - 1]}.jpg')

        # increment counter
        self.counters[class_num - 1] += 1

    # reset application state
    def reset(self):
        # iterate through image directories
        for directory in ['1', '2']:
            # iterate over files within each directory
            for file in os.listdir(directory):
                # create file path name from directory and file
                file_path = os.path.join(directory, file)
                # remove/unlink file if possible
                if(os.path.isfile(file_path)):
                    os.unlink(file_path)

        # reset counters
        self.counters = [1,1]

        # reset model
        #self.model = model.Model()

        # reset class label on GUI
        self.class_label.config(text="CLASS")

    # update the displayed image in the GUI
    def update(self):
        # make prediction if autopredict is 'on'
        if self.auto_predict:
            self.predict()

        # get frame from camera
        ret, frame = self.camera.get_frame()

        if ret:
            # convert image from frame to ImageTk so it can be used in GUI
            self.photo = PIL.ImageTk.PhotoImage(image=PIL.Image.fromarray(frame))

            # display image on GUI
            self.canvas.create_image(0,0,image=self.photo, anchor=tk.NW)

        # recursively call update function after delay
        self.window.after(self.delay, self.update)

    def predict(self):
        frame = self.camera.get_frame()
        prediction = self.model.predict(frame)

        if prediction == 1:
            self.class_label.config(text=self.classname_one)
            return self.classname_one
        if prediction == 2:
            self.class_label.config(text=self.classname_two)
            return self.classname_two