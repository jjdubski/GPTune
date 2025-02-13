from django.http import JsonResponse
from datetime import datetime

def index(request):
    current_time = datetime.now().strftime("%H:%M:%S")
    current_date = datetime.now().strftime("%d-%m-%Y")

    data = {
        'current_time': current_time,
        'current_date': current_date
    }
    
    return JsonResponse(data)