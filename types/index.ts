export interface Course {
  name: string;
  degree: string;
  annualFee: number;
}

export interface PlacementYear {
  year: number;
  avgPackage: number;
  maxPackage: number;
  placementRate: number;
  topRecruiters: string[];
}

export interface Cutoff {
  exam: string;
  year: number;
  category: string;
  cutoffValue: number;
}

export interface College {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: "Government" | "Private" | "Deemed";
  streams: string[];
  nirfRank: number;
  established: number;
  acreditation: string;
  website: string;
  overview: string;
  annualFee: number;
  courses: Course[];
  placements: PlacementYear[];
  cutoffs: Cutoff[];
  tags: string[];
  logo?: string;
  banner?: string;
}
