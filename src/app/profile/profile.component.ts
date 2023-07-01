import { Component, OnInit } from "@angular/core";
import { HeaderService } from "../shared/services/header/header.service";
import { Auth, user } from "@angular/fire/auth";
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  doc,
  updateDoc,
} from "@angular/fire/firestore";
import { Observable, take } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  //edit mode is initially set to false
  inEditMode = false;
  btnStatus = "Edit";

  //form has not been submitted and it is assumed to be valid
  submitAttempted = false;
  formValid = true;

  userProfileId = "";
  firstName = "";
  lastName = "";
  streetAddr = "";
  city = "";
  state = "FL";
  zipCode = "";
  userId = "";

  constructor(
    public headerService: HeaderService,
    public auth: Auth,
    public firestore: Firestore,
  ) {
    headerService.setHeader("Profile");
  }

  ngOnInit(): void {
    //get user data from db
    const userObservable = user(this.auth);
    userObservable.subscribe({
      next: (user) => {
        const userProfilesCollection = collection(
          this.firestore,
          "UserProfiles",
        );
        const userQuery = query(
          userProfilesCollection,
          where("userId", "==", user?.uid),
        );
        const userProfilesObservable: Observable<any> =
          collectionData(userQuery);
        userProfilesObservable.pipe(take(1)).subscribe({
          next: (userProfiles) => {
            this.userProfileId = userProfiles[0].userProfileId;
            this.firstName = userProfiles[0].firstName;
            this.lastName = userProfiles[0].lastName;
            this.streetAddr = userProfiles[0].streetAddr;
            this.city = userProfiles[0].city;
            this.state = userProfiles[0].state;
            this.zipCode = userProfiles[0].zipCode;
            this.userId = userProfiles[0].userId;
          },
        });
      },
    });
  }

  toggleEditMode() {
    const inputsFields = document.querySelectorAll("input");

    if (!this.inEditMode) {
      this.inEditMode = true;
      this.btnStatus = "Submit";
      document.getElementById("editButton")?.classList.remove("btn-primary");
      document.getElementById("editButton")?.classList.add("btn-success");
      inputsFields.forEach((input) => {
        input.classList.remove("form-control-plaintext");
        input.classList.add("form-control");
      });
    } else {
      //submission has been attempted so we check that the data is valid
      //before updating the db
      this.submitAttempted = true;
      this.validate();

      if (this.formValid) {
        const updatedUserProfile = {
          userId: this.userId,
          firstName: this.firstName,
          lastName: this.lastName,
          streetAddr: this.streetAddr,
          city: this.city,
          state: this.state,
          zipCode: this.zipCode,
        };

        const userProfilesCollection = collection(
          this.firestore,
          "UserProfiles",
        );
        const userProfileDoc = doc(this.firestore, this.userProfileId);
        updateDoc(userProfileDoc, updatedUserProfile);

        //user data has been updated we can then revert to edit mode
        this.inEditMode = false;
        this.btnStatus = "Edit";
        document.getElementById("editButton")?.classList.add("btn-primary");
        document.getElementById("editButton")?.classList.remove("btn-success");
        inputsFields.forEach((input) => {
          input.classList.add("form-control-plaintext");
          input.classList.remove("form-control");
        });
      }
    }
  }

  validate(): void {
    if (this.submitAttempted) {
      this.formValid = true;
      this.validateInput(this.firstName, "firstNameInput", /[a-zA-Z]{2,}/g);
      this.validateInput(this.lastName, "lastNameInput", /[a-zA-Z]{2,}/g);
      this.validateInput(
        this.streetAddr,
        "streetAddrInput",
        /\d+\s+\w+\s+\w+/g,
      );
      this.validateInput(this.city, "cityInput", /[a-zA-Z]{2,}/g);
      this.validateInput(this.state, "stateInput", /FL/g);
      this.validateInput(this.zipCode, "zipCodeInput", /\d{5}/g);
    }
  }

  validateInput(input: string, inputField: string, pattern: RegExp): void {
    if (pattern.test(input)) {
      document.getElementById(inputField)?.classList.remove("is-invalid");
    } else {
      this.formValid = false;
      document.getElementById(inputField)?.classList.add("is-invalid");
    }
  }
}
