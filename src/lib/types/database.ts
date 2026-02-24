export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          status: "active" | "sold" | "reserved"
          category_id: string | null
          image_urls: string[]
          reserved_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          status?: "active" | "sold" | "reserved"
          category_id?: string | null
          image_urls?: string[]
          reserved_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          status?: "active" | "sold" | "reserved"
          category_id?: string | null
          image_urls?: string[]
          reserved_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          product_id: string | null
          buyer_name: string
          buyer_phone: string
          buyer_email: string
          sinpe_reference: string
          status: "pending" | "verified" | "rejected"
          created_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          buyer_name: string
          buyer_phone: string
          buyer_email: string
          sinpe_reference: string
          status?: "pending" | "verified" | "rejected"
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          buyer_name?: string
          buyer_phone?: string
          buyer_email?: string
          sinpe_reference?: string
          status?: "pending" | "verified" | "rejected"
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
