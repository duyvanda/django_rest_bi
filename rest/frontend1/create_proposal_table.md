```sql
CREATE TABLE form_seminar_hco (
    id TEXT PRIMARY KEY,
    manv TEXT NOT NULL,
    inserted_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status TEXT, -- Status of the proposal (e.g., 'H' for pending)
    hco TEXT,       -- Comma-separated IDs of selected HCOs
    smn_thang TEXT,
    tuan_thuc_hien TEXT,
    nhom_san_pham TEXT,
    so_luong_bs_ds NUMERIC,
    dia_diem TEXT,
    muc_dich TEXT,
    chi_phi_hoi_truong NUMERIC,
    chi_phi_may_chieu NUMERIC,
    chi_phi_an_uong NUMERIC,
    chi_phi_teabreak NUMERIC,
    chi_phi_bao_cao_vien NUMERIC,
    tang_pham NUMERIC
);
```