import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AddressService } from 'src/app/service/address.service';
import { ProfileService } from 'src/app/service/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
 

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})

export class HomepageComponent implements OnInit {

  profiles: any[] = [];
  addresses: any[] = [];
  selectedProfile: any; 
  isEditMode: any;
  
  constructor(
    private profileService: ProfileService,
    // private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  searchForm = new FormGroup({
    search: new FormControl('')
  });
  page: number = 1;
  size = 10
  offName: any = null;
  userPosition: any = null;
  dataprofile = []
  totalElements: number
  showNoResultsMessage: boolean = false;


  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles() {
    this.profileService.getAllProfiles().subscribe(
      (data) => {
        this.profiles = data;
        console.log("data",data);
      },
      (error) => {
        console.error('Error fetching profiles: ', error);
      }
    );
  }

  serchGetProfile(data : any){
    this.onGetprofile()
  }

  onGetprofile(){
    this.profileService.serchGetProfile(this.searchForm.get('search').value, this.page, this.size).subscribe((res: any) => {
      this.dataprofile = res.content
      if (res.content.length === null) {
        this.showNoResultsMessage = true;
      }
      else {
        this.totalElements = res.totalElements
        this.showNoResultsMessage = false;
      }
    })

  }


  editProfile(profileId: number): void {
    if (profileId !== undefined && profileId !== null) {
      this.isEditMode = true;
      this.router.navigate(['/formuser', profileId]);
      console.log("profileId :",profileId);
      
    } else {
      console.log("error");
      
    }
  }
  
  
  deTails(id: number) {
    console.log("profile Id : ", id);
    this.profileService.getProfileAndAddressById(id).subscribe(
      (data) => {
        this.selectedProfile = data;
        this.addresses = data.addresses; 
        console.log(data);
      },
      (error) => {
        console.error('Error fetching profile and addresses: ', error);
      }
    );
  }

  
  deleteProfile(id: number): void {
    console.log("profile Id : ", id);

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.profileService.deleteProfileAndAddress(id)
          .subscribe(
            response => {
              this.getProfiles();
              Swal.fire(
                'Deleted!',
                'Profile has been deleted.',
                'success'
              );
            },
            error => {
              Swal.fire(
                'Error!',
                'There was an error deleting the profile.',
                'error'
              );
              console.error('Error deleting profile:', error);
            }
          );
      }
    });
  }
  
}
