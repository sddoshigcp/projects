import cv2 as cv

class Camera:

    # initialize camera
    def __init__(self):
        self.camera = cv.VideoCapture(0)
        if not self.camera.isOpened():
            raise ValueError("Unable to open the camera.")

        # set width and height of camera
        self.width = self.camera.get(cv.CAP_PROP_FRAME_WIDTH)
        self.height = self.camera.get(cv.CAP_PROP_FRAME_HEIGHT)

    # delete camera
    def __del__(self):
        if self.camera.isOpened():
            self.camera.release()

    # get frame from camera
    def get_frame(self):
        if self.camera.isOpened():
            # read current frame
            ret, frame = self.camera.read()
            if ret:
                # return current frame with color as RGB
                return ret, cv.cvtColor(frame, cv.COLOR_BGR2RGB)
            else:
                return ret, None
        else:
            return None