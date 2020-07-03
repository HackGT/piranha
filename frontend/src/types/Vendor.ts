import { gql } from "@apollo/client";

export type Vendor = {
  id: number,
  name: string,
  isActive: boolean
}

export const MANAGE_VENDORS_QUERY = gql`
  query manageVendors {
    vendors {
      id
      name
      isActive
    }
  }
`;

export const CREATE_VENDOR_MUTATION = gql`
  mutation createVendor($data: VendorInput!) {
    createVendor(data: $data) {
      vendor {
        id
      }
    }
  }
`;

export const UPDATE_VENDOR_MUTATION = gql`
  mutation updateVendor($data: VendorInput!, $id: ID!) {
    updateVendor(data: $data, id: $id) {
      vendor {
        id
      }
    }
  }
`;
