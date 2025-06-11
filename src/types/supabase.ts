export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      Puzzles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          correct_list: string[];
          autocomplete_list: string[];
          list_length: number;
          created_at: string;
        };
      };
    };
  };
}
