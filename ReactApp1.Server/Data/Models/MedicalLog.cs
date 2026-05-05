using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ReactApp1.Server.Data.Models
{
    public class MedicalLog
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("PatientId")]
        public string PatientId { get; set; } = null!;

        [BsonElement("DeviceName")]
        public string DeviceName { get; set; } = null!;

        [BsonElement("ReadingType")]
        public string ReadingType { get; set; } = null!; // e.g. HeartRate, BloodPressure

        [BsonElement("ReadingValue")]
        public string ReadingValue { get; set; } = null!;

        [BsonElement("Timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [BsonElement("IsCritical")]
        public bool IsCritical { get; set; } = false;
    }
}
