namespace SolskaKnjiznica.Core.Entities;

public enum UserRole
{
    Student,
    Librarian
}

public class Uporabnik
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string GesloHash { get; set; } = string.Empty;
    public string Ime { get; set; } = string.Empty;
    public string Priimek { get; set; } = string.Empty;
    public string Vloga { get; set; } = string.Empty; // Store as string for flexibility
    public DateTime UstvarjenOb { get; set; } = DateTime.UtcNow;

    public UserRole Role => Enum.TryParse<UserRole>(Vloga, true, out var role) ? role : UserRole.Student;
}
