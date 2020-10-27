import { gql } from "@apollo/client";

export type Vendor = {
  id: number,
  name: string,
  isActive: boolean
}

export const VENDOR_INFO_FRAGMENT = gql`
  fragment VendorInfoFragment on Vendor {
    id
    name
    isActive
  }
`;

export const VENDOR_LIST_QUERY = gql`
  query vendorList {
    vendors {
      ...VendorInfoFragment
    }
  }
  ${VENDOR_INFO_FRAGMENT}
`;

export const CREATE_VENDOR_MUTATION = gql`
  mutation createVendor($data: VendorInput!) {
    createVendor(data: $data) {
      ...VendorInfoFragment
    }
  }
  ${VENDOR_INFO_FRAGMENT}
`;

export const UPDATE_VENDOR_MUTATION = gql`
  mutation updateVendor($data: VendorInput!, $id: ID!) {
    updateVendor(data: $data, id: $id) {
      ...VendorInfoFragment
    }
  }
  ${VENDOR_INFO_FRAGMENT}
`;
