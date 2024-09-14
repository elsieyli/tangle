export interface NavLink {
   id: string;
   title: string;
 }
 
 // Define the array of navigation links with type annotation
 export const NavLinks: NavLink[] = [
   {
     id: "about",
     title: "About",
   },
   {
     id: "work",
     title: "Work",
   },
   {
     id: "contact",
     title: "Contact",
   },
 ];