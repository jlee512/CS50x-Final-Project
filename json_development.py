import json
import io
import os


class Badge:
    _award_id = None
    _badge_id = None
    _walk_id = None
    _badge_name = None
    _badge_description = None
    _badge_img_path = None
    _badge_json = None

    # Constructor for the badge class
    def __init__(self):
        pass

    def set_parameters(self):
        self._badge_name = input('Enter a name for the badge: ')
        self._badge_description = input('Enter a description for the badge: ')
        self._walk_id = input('Enter the walk id that this badge corresponds to (0 for none): ')
        self._badge_img_path = "/static/Media/Photographs/Badges/" + self._badge_name + ".jpg"

    def set_award_id(self, award_id):
        self._award_id = award_id

    def set_badge_id(self, badge_id):
        self._badge_id = badge_id

    def construct_json(self):
        # Construct json object for badge if
        self._badge_json = {"badge_id": self._badge_id, "badge_name": self._badge_name, "walk_id": self._walk_id,
                          "badge_description": self._badge_description, "badge_img_path": self._badge_img_path}

    def display(self):
        print("Badge_id: " + str(self._badge_id) + ", badge_name: " + str(self._badge_name))
        print("Badge_Description: " + str(self._badge_description))
        print("Badge_IMG_Path: " + str(self._badge_img_path))

    def append_to_json(self):
        if None not in [self._badge_name, self._badge_description, self._badge_img_path]:
            # Open JSON  file and append
            json_file_path = os.path.join("static", "JSON/Badges.json")
            with open(json_file_path) as file:
                if os.stat(json_file_path).st_size == 0:
                    data = []
                    # Assign badge_id of 1 if no badges present
                    self.set_badge_id(1)
                    self.construct_json()
                    data.append(self._badge_json)
                    with open(json_file_path, "w") as file:
                        json.dump(data, file)
                else:
                    data = json.load(file)
                    # Assign badge_id according to last badge already stored in JSON file
                    new_badge_id = data[-1]["badge_id"] + 1
                    self.set_badge_id(new_badge_id)
                    self.construct_json()
                    data_new = self._badge_json
                    data.append(data_new)
                    with open(json_file_path, "w") as file:
                        json.dump(data, file)
        else:
            print("JSON data has not been generated")


def initialise_badge_file():
    while True:
        try:
            number_of_badges = int(input('Please enter the number of badges you would like to enter initially: '))
            # Number of badges successfully parsed, progress to processing
            if number_of_badges <= 0:
                print("Sorry you did not enter a positive integer, please try again")
                continue
            break

        except ValueError:
            print("Sorry you did not enter a number, please try again")
            continue

    add_badges_to_file(number_of_badges)


def add_badges_to_file(number_of_badges):
    for i in range(number_of_badges):
        badge_to_add = Badge()
        badge_to_add.set_parameters()
        badge_to_add.display()
        badge_to_add.append_to_json()


def main():
    empty = input('Would you like to empty the badges database? (Y) or (ANY KEY)? ')

    if empty.lower() == 'y':
        f = open(os.path.join("static", "JSON/Badges.json"),"w").close()

    initialise_badge_file()


if __name__ == "__main__":
    main()
