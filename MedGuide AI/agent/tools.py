from storage.memory import user_data
from utils.date_parser import detect_appointment_from_text

class AgentTools:
    @staticmethod
    def add_appointment_from_text(text):
        appt_info = detect_appointment_from_text(text)
        if appt_info:
            appointment = {
                "title": f"Appointment with {appt_info['provider']}",
                "provider": appt_info['provider'],
                "date": appt_info['date'],
                "time": "09:00",
                "fromChat": True
            }
            user_data['appointments'].append(appointment)
            return appointment
        return None

    @staticmethod
    def add_medication_from_text(text):
        import re
        med_match = re.search(r'(?:take|taking|prescribed)\s+([a-zA-Z]+)\s+(\d+mg)', text, re.IGNORECASE)
        if med_match:
            medication = {
                "name": med_match.group(1).capitalize(),
                "dosage": med_match.group(2),
                "frequency": "Daily",
                "time": "08:00"
            }
            user_data['medications'].append(medication)
            return medication
        return None