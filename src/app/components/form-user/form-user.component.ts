import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss']
})
export class FormUserComponent implements OnInit {
  profileImageUrl: string | ArrayBuffer | null = "assets/img/th.jpg";
  profileForm: FormGroup;
  isEditMode = false;
  profileId: number | null = null;
  originalAddresses: any[] = []; 
  addressesToDelete: number[] = [];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      image: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      addresses: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.profileId = +params['id'];
        if (this.profileId) {
          this.isEditMode = true;
          this.initializeForm();
        }
      } else {
        this.addAddress();
      }
    });
  }

  initializeForm(): void {
    if (this.profileId !== null) {
      this.profileService.getProfileAndAddressById(this.profileId).subscribe(
        (data) => {
          this.profileForm.patchValue({
            id: data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            telephone: data.telephone,
            email: data.email,
            password: data.password,
          });
          this.profileImageUrl = data.image;
          this.originalAddresses = data.addresses;
          this.profileForm.setControl('addresses', this.fb.array(this.mapAddresses(data.addresses)));
        },
        (error) => {
          console.error('Error fetching profile data:', error);
          Swal.fire('Error', 'Failed to load profile data', 'error');
        }
      );
    }
  }

  mapAddresses(addresses: any[]): FormGroup[] {
    return addresses.map(address => this.fb.group({
      id: [address.id], // เก็บ id ไว้ด้วย
      houseNo: [address.houseNo],
      moo: [address.moo],
      soi: [address.soi],
      road: [address.road],
      districtName: [address.districtName],
      subdistrictName: [address.subdistrictName],
      provinceName: [address.provinceName],
      zipcode: [address.zipcode]
    }));
  }

  onChange(image: FileList | null) {
    if (image && image.length > 0) {
      const file = image[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profileImageUrl = reader.result;
      };
    }
  }

  createAddressGroup(): FormGroup {
    return this.fb.group({
      id: [null], 
      houseNo: [''],
      moo: [''],
      soi: [''],
      road: [''],
      districtName: [''],
      subdistrictName: [''],
      provinceName: [''],
      zipcode: ['']
    });
  }

  get addressesFormArray(): FormArray {
    return this.profileForm.get('addresses') as FormArray;
  }

  addAddress(): void {
    this.addressesFormArray.push(this.createAddressGroup());
  }

  removeAddress(index: number): void {
    const addressGroup = this.addressesFormArray.at(index);
    if (addressGroup.value.id !== null) {
      this.addressesToDelete.push(addressGroup.value.id);
    }
    this.addressesFormArray.removeAt(index);
  }

  onSubmit(): void {
    this.profileForm.value.image = this.profileImageUrl;
    const formData = this.profileForm.value;

    if (this.isEditMode) {
      formData.id = this.profileId;

      formData.addresses.forEach((address: any, index: number) => {
        if (index < this.originalAddresses.length) {
          address.id = this.originalAddresses[index].id; // ใช้ address id เดิม
        }
      });
      formData.listdeletekey = this.addressesToDelete;
      console.log("formData",formData);
      

      this.profileService.updateProfileAndAddress(formData).subscribe(
        response => {
          console.log("update");
          Swal.fire({
            text: 'บันทึกข้อมูลสำเร็จ',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/homepage']);
        },
        error => {
          Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกได้', 'error');
          console.error('Update error:', error);
        }
      );
    } else {
      this.profileService.saveProfileAndAddress(formData).subscribe(
        response => {
          Swal.fire({
            text: 'บันทึกข้อมูลสำเร็จ',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/homepage']);
        },
        error => {
          Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกได้', 'error');
          console.error('Save error:', error);
        }
      );
    }
  }

}
